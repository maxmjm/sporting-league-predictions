import express from "express";
import sqlite3 from "sqlite3";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the path to the SQLite database file
const databaseFilePath = path.join(
  __dirname,
  "data",
  "sporting-league-predictions.db"
);

// Initialise the SQLite database
const database = new sqlite3.Database(databaseFilePath);

// Create the table for NBA player awards predictions if it doesn't exist
database.run(`
  CREATE TABLE IF NOT EXISTS nba_player_awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL, -- Username of the predictor
    most_valuable_player TEXT, -- MVP player name
    rookie_of_the_year TEXT, -- Rookie of the Year player name
    defensive_player_of_the_year TEXT, -- Defensive Player of the Year name
    most_improved_player TEXT, -- Most Improved Player name
    sixth_man_of_the_year TEXT, -- Sixth Man of the Year name
    clutch_player_of_the_year TEXT, -- Clutch Player of the Year name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of record creation
  )
`);

// Create the table for Eastern Conference predictions if it doesn't exist
database.run(`
  CREATE TABLE IF NOT EXISTS eastern_conference_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL, -- Username of the predictor
    team_name TEXT NOT NULL, -- Name of the team
    seed INTEGER NOT NULL, -- Predicted seed in the conference
    win_total INTEGER NOT NULL, -- Predicted total wins
    big_call TEXT, -- Bold prediction for the team
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of record creation
  )
`);

// Create the table for Western Conference predictions if it doesn't exist
database.run(`
  CREATE TABLE IF NOT EXISTS western_conference_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL, -- Username of the predictor
    team_name TEXT NOT NULL, -- Name of the team
    seed INTEGER NOT NULL, -- Predicted seed in the conference
    win_total INTEGER NOT NULL, -- Predicted total wins
    big_call TEXT, -- Bold prediction for the team
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of record creation
  )
`);

// Endpoint to save NBA player awards predictions
app.post("/save-player-awards", (req, res) => {
  const {
    username,
    most_valuable_player,
    rookie_of_the_year,
    defensive_player_of_the_year,
    most_improved_player,
    sixth_man_of_the_year,
    clutch_player_of_the_year,
  } = req.body;

  const insertPlayerAwardsQuery = `
    INSERT INTO nba_player_awards (
      username,
      most_valuable_player,
      rookie_of_the_year,
      defensive_player_of_the_year,
      most_improved_player,
      sixth_man_of_the_year,
      clutch_player_of_the_year
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  database.run(
    insertPlayerAwardsQuery,
    [
      username,
      most_valuable_player,
      rookie_of_the_year,
      defensive_player_of_the_year,
      most_improved_player,
      sixth_man_of_the_year,
      clutch_player_of_the_year,
    ],
    function (err) {
      if (err) {
        return res.status(500).send("Error saving Player Awards predictions!");
      }
      res.status(200).send({
        message: "Player Awards predictions saved successfully!",
        id: this.lastID, // ID of the newly inserted record
      });
    }
  );
});

// Endpoint to save Eastern Conference predictions
app.post("/save-eastern-conference", (req, res) => {
  const { username, team_name, seed, win_total, big_call } = req.body;

  const insertEasternConferenceQuery = `
    INSERT INTO eastern_conference_predictions (
      username,
      team_name,
      seed,
      win_total,
      big_call
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  database.run(
    insertEasternConferenceQuery,
    [username, team_name, seed, win_total, big_call],
    function (err) {
      if (err) {
        return res
          .status(500)
          .send("Error saving Eastern Conference predictions!");
      }
      res.status(200).send({
        message: "Eastern Conference predictions saved successfully!",
        id: this.lastID, // ID of the newly inserted record
      });
    }
  );
});

// Endpoint to save Western Conference predictions
app.post("/save-western-conference", (req, res) => {
  const { username, team_name, seed, win_total, big_call } = req.body;

  const insertWesternConferenceQuery = `
    INSERT INTO western_conference_predictions (
      username,
      team_name,
      seed,
      win_total,
      big_call
    )
    VALUES (?, ?, ?, ?)
  `;

  database.run(
    insertWesternConferenceQuery,
    [username, team_name, seed, win_total, big_call],
    function (err) {
      if (err) {
        return res
          .status(500)
          .send("Error saving Western Conference predictions!");
      }
      res.status(200).send({
        message: "Western Conference predictions saved successfully!",
        id: this.lastID, // ID of the newly inserted record
      });
    }
  );
});

// Serve static files from the "html" directory
app.use(express.static(path.join(__dirname, "html")));

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/all-nba-regular-season-predictions", (req, res) => {
  const results = {};

  const fetchPlayerAwards = `SELECT * FROM nba_player_awards`;
  const fetchEasternConference = `SELECT * FROM eastern_conference_predictions`;
  const fetchWesternConference = `SELECT * FROM western_conference_predictions`;

  database.all(fetchPlayerAwards, [], (err, playerAwardsRows) => {
    if (err)
      return res.status(500).send("Error fetching Player Awards predictions!");
    results.playerAwards = playerAwardsRows;

    database.all(fetchEasternConference, [], (err, easternConferenceRows) => {
      if (err)
        return res
          .status(500)
          .send("Error fetching Eastern Conference predictions!");
      results.easternConference = easternConferenceRows;

      database.all(fetchWesternConference, [], (err, westernConferenceRows) => {
        if (err)
          return res
            .status(500)
            .send("Error fetching Western Conference predictions!");
        results.westernConference = westernConferenceRows;

        res.status(200).json(results);
      });
    });
  });
});
