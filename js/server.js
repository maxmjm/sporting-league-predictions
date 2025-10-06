const express = require("express");
const path = require("path");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required by Render
});

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "..", "html")));
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));

// Create tables once (ideally use migration tools later)
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eastern_conference_predictions (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        team_name TEXT NOT NULL,
        seed INTEGER NOT NULL,
        win_total INTEGER NOT NULL,
        big_call TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS western_conference_predictions (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        team_name TEXT NOT NULL,
        seed INTEGER NOT NULL,
        win_total INTEGER NOT NULL,
        big_call TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS nba_player_awards_predictions (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        most_valuable_player_1 TEXT,
        most_valuable_player_2 TEXT,
        most_valuable_player_3 TEXT,
        rookie_of_the_year_1 TEXT,
        rookie_of_the_year_2 TEXT,
        rookie_of_the_year_3 TEXT,
        defensive_player_of_the_year_1 TEXT,
        defensive_player_of_the_year_2 TEXT,
        defensive_player_of_the_year_3 TEXT,
        most_improved_player_1 TEXT,
        most_improved_player_2 TEXT,
        most_improved_player_3 TEXT,
        sixth_man_of_the_year_1 TEXT,
        sixth_man_of_the_year_2 TEXT,
        sixth_man_of_the_year_3 TEXT,
        clutch_player_of_the_year_1 TEXT,
        clutch_player_of_the_year_2 TEXT,
        clutch_player_of_the_year_3 TEXT,
        coach_of_the_year_1 TEXT,
        coach_of_the_year_2 TEXT,
        coach_of_the_year_3 TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ PostgreSQL tables ready.");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    throw err;
  }
}

const pickThree = (arr = []) => [
  arr[0] ?? null,
  arr[1] ?? null,
  arr[2] ?? null,
];

// POST: Save all predictions
app.post("/save-all-nba-regular-season-predictions", async (req, res) => {
  const {
    username,
    easternConference = [],
    westernConference = [],
    playerAwards = {},
  } = req.body;

  if (
    !username ||
    !Array.isArray(easternConference) ||
    !Array.isArray(westernConference)
  ) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert east teams
    for (const team of easternConference) {
      await client.query(
        `INSERT INTO eastern_conference_predictions (username, team_name, seed, win_total, big_call)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null,
        ]
      );
    }

    // Insert west teams
    for (const team of westernConference) {
      await client.query(
        `INSERT INTO western_conference_predictions (username, team_name, seed, win_total, big_call)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null,
        ]
      );
    }

    // Build awards array with 22 values (1 username + 7 categories * 3)
    const awardsValues = [
      username,
      ...pick3(playerAwards.most_valuable_player),
      ...pick3(playerAwards.rookie_of_the_year),
      ...pick3(playerAwards.defensive_player_of_the_year),
      ...pick3(playerAwards.most_improved_player),
      ...pick3(playerAwards.sixth_man_of_the_year),
      ...pick3(playerAwards.clutch_player_of_the_year),
      ...pick3(playerAwards.coach_of_the_year),
    ];

    // Insert player awards
    await client.query(
      `INSERT INTO nba_player_awards_predictions (
        username,
        most_valuable_player_1, most_valuable_player_2, most_valuable_player_3,
        rookie_of_the_year_1, rookie_of_the_year_2, rookie_of_the_year_3,
        defensive_player_of_the_year_1, defensive_player_of_the_year_2, defensive_player_of_the_year_3,
        most_improved_player_1, most_improved_player_2, most_improved_player_3,
        sixth_man_of_the_year_1, sixth_man_of_the_year_2, sixth_man_of_the_year_3,
        clutch_player_of_the_year_1, clutch_player_of_the_year_2, clutch_player_of_the_year_3,
        coach_of_the_year_1, coach_of_the_year_2, coach_of_the_year_3
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
      awardsValues
    );

    await client.query("COMMIT");

    res
      .status(200)
      .json({ message: "All predictions submitted successfully!" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error saving predictions:", err);
    res.status(500).json({ error: "Failed to save predictions." });
  } finally {
    client.release();
  }
});

// GET: Fetch all predictions
app.get("/get-all-nba-regular-season-predictions", async (req, res) => {
  try {
    const [east, west, awards] = await Promise.all([
      pool.query("SELECT * FROM eastern_conference_predictions"),
      pool.query("SELECT * FROM western_conference_predictions"),
      pool.query("SELECT * FROM nba_player_awards_predictions"),
    ]);

    res.status(200).json({
      easternConference: east.rows,
      westernConference: west.rows,
      playerAwards: awards.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching predictions:", err);
    res.status(500).json({ error: "Failed to fetch predictions!" });
  }
});

// Route to load index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "html", "index.html"));
});

// Start server only after tables are ready
(async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize:", err);
    process.exit(1);
  }
})();
