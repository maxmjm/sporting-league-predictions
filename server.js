const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

const databaseFilePath = path.join(
  __dirname,
  "data",
  "sporting-league-predictions.db"
);
const database = new sqlite3.Database(databaseFilePath);

// Create tables if they don't exist
const createDatabaseTables = () => {
  database.run(`
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

  database.run(`
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

  database.run(`
    CREATE TABLE IF NOT EXISTS nba_player_awards_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      most_valuable_player TEXT,
      rookie_of_the_year TEXT,
      defensive_player_of_the_year TEXT,
      most_improved_player TEXT,
      sixth_man_of_the_year TEXT,
      clutch_player_of_the_year TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

createDatabaseTables();

// Unified endpoint to save all predictions
app.post("/save-all-nba-regular-season-predictions", (req, res) => {
  const {
    username,
    easternConference: easternConferenceTeams,
    westernConference: westernConferenceTeams,
    playerAwards,
  } = req.body;

  const insertEasternConferencePredictions = database.prepare(`
    INSERT INTO eastern_conference_predictions (username, team_name, seed, win_total, big_call)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertWesternConferencePredictions = database.prepare(`
    INSERT INTO western_conference_predictions (username, team_name, seed, win_total, big_call)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertPlayerAwardsPredictions = database.prepare(`
    INSERT INTO nba_player_awards_predictions (
      username, most_valuable_player, rookie_of_the_year,
      defensive_player_of_the_year, most_improved_player,
      sixth_man_of_the_year, clutch_player_of_the_year
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  database.serialize(() => {
    try {
      easternConferenceTeams.forEach((team) => {
        insertEasternConferencePredictions.run(
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null
        );
      });

      westernConferenceTeams.forEach((team) => {
        insertWesternConferencePredictions.run(
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null
        );
      });

      insertPlayerAwardsPredictions.run(
        username,
        playerAwards.most_valuable_player,
        playerAwards.rookie_of_the_year,
        playerAwards.defensive_player_of_the_year,
        playerAwards.most_improved_player,
        playerAwards.sixth_man_of_the_year,
        playerAwards.clutch_player_of_the_year
      );

      insertEasternConferencePredictions.finalize();
      insertWesternConferencePredictions.finalize();
      insertPlayerAwardsPredictions.finalize();

      res
        .status(200)
        .send({ message: "All predictions submitted successfully!" });
    } catch (err) {
      console.error("Error inserting predictions:", err);
      res.status(500).send("Failed to submit predictions.");
    }
  });
});

// Endpoint to fetch all predictions
app.get("/get-all-nba-regular-season-predictions", (req, res) => {
  const allNBARegularSeasonPredictions = {};
  const databaseQueries = {
    easternConference: `SELECT * FROM eastern_conference_predictions`,
    westernConference: `SELECT * FROM western_conference_predictions`,
    playerAwards: `SELECT * FROM nba_player_awards_predictions`,
  };

  database.all(databaseQueries.playerAwards, [], (err, playerAwardsRows) => {
    if (err)
      return res.status(500).send("Error fetching Player Awards predictions!");
    allNBARegularSeasonPredictions.playerAwards = playerAwardsRows;

    database.all(databaseQueries.easternConference, [], (err, eastRows) => {
      if (err)
        return res
          .status(500)
          .send("Error fetching Eastern Conference predictions!");
      allNBARegularSeasonPredictions.easternConference = eastRows;

      database.all(databaseQueries.westernConference, [], (err, westRows) => {
        if (err)
          return res
            .status(500)
            .send("Error fetching Western Conference predictions!");
        allNBARegularSeasonPredictions.westernConference = westRows;

        res.status(200).json(allNBARegularSeasonPredictions);
      });
    });
  });
});

// Serve front-end static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

app.use(express.static(path.join(__dirname, "html")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
