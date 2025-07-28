const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON bodies

// Path to SQLite database
const DB_PATH = path.join(
  __dirname,
  "..",
  "data",
  "sporting-league-predictions.db"
);
// Create the database directory if it doesn't exist
const db = new sqlite3.Database(DB_PATH);

// Ensure tables exist
const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS eastern_conference_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      team_name TEXT NOT NULL,
      seed INTEGER NOT NULL,
      win_total INTEGER NOT NULL,
      big_call TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS western_conference_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      team_name TEXT NOT NULL,
      seed INTEGER NOT NULL,
      win_total INTEGER NOT NULL,
      big_call TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS nba_player_awards_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

createTables();

// Save predictions
app.post("/save-all-nba-regular-season-predictions", (req, res) => {
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

  const insertEast = db.prepare(`
    INSERT INTO eastern_conference_predictions (username, team_name, seed, win_total, big_call)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertWest = db.prepare(`
    INSERT INTO western_conference_predictions (username, team_name, seed, win_total, big_call)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertAwards = db.prepare(`
    INSERT INTO nba_player_awards_predictions (
      username,
      most_valuable_player_1, most_valuable_player_2, most_valuable_player_3,
      rookie_of_the_year_1, rookie_of_the_year_2, rookie_of_the_year_3,
      defensive_player_of_the_year_1, defensive_player_of_the_year_2, defensive_player_of_the_year_3,
      most_improved_player_1, most_improved_player_2, most_improved_player_3,
      sixth_man_of_the_year_1, sixth_man_of_the_year_2, sixth_man_of_the_year_3,
      clutch_player_of_the_year_1, clutch_player_of_the_year_2, clutch_player_of_the_year_3
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.serialize(() => {
    try {
      easternConference.forEach((team) => {
        insertEast.run(
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null
        );
      });

      westernConference.forEach((team) => {
        insertWest.run(
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null
        );
      });

      insertAwards.run(
        username,
        ...(playerAwards.most_valuable_player || []),
        ...(playerAwards.rookie_of_the_year || []),
        ...(playerAwards.defensive_player_of_the_year || []),
        ...(playerAwards.most_improved_player || []),
        ...(playerAwards.sixth_man_of_the_year || []),
        ...(playerAwards.clutch_player_of_the_year || [])
      );

      res
        .status(200)
        .json({ message: "All predictions submitted successfully!" });
    } catch (error) {
      console.error("Error inserting predictions:", error);
      res.status(500).json({ error: "Failed to submit predictions!" });
    } finally {
      insertEast.finalize();
      insertWest.finalize();
      insertAwards.finalize();
    }
  });
});

// Get all predictions
app.get("/get-all-nba-regular-season-predictions", (req, res) => {
  const response = {};

  db.all(
    "SELECT * FROM nba_player_awards_predictions",
    [],
    (err, awardsRows) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to fetch Player Awards predictions!" });

      response.playerAwards = awardsRows;

      db.all(
        "SELECT * FROM eastern_conference_predictions",
        [],
        (err, eastRows) => {
          if (err)
            return res.status(500).json({
              error: "Failed to fetch Eastern Conference predictions!",
            });

          response.easternConference = eastRows;

          db.all(
            "SELECT * FROM western_conference_predictions",
            [],
            (err, westRows) => {
              if (err)
                return res.status(500).json({
                  error: "Failed to fetch Western Conference predictions!",
                });

              response.westernConference = westRows;
              res.status(200).json(response);
            }
          );
        }
      );
    }
  );
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "html")));
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "html", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
