const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define path to SQLite database file
const databaseFilePath = path.join(
  __dirname,
  "data",
  "sporting-league-predictions.db"
);

// Initialise SQLite database
const database = new sqlite3.Database(databaseFilePath);

// Create Eastern Conference Predictions table
database.run(`
  CREATE TABLE IF NOT EXISTS eastern_conference_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL, -- Username of the predictor
    team_name TEXT NOT NULL, -- Name of the team
    seed INTEGER NOT NULL, -- Predicted seed in the conference
    win_total INTEGER NOT NULL, -- Predicted total wins
    big_call TEXT, -- Big Call for the team
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of record creation
  )
`);

// Create Western Conference Predictions table
database.run(`
  CREATE TABLE IF NOT EXISTS western_conference_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL, -- Username of the predictor
    team_name TEXT NOT NULL, -- Name of the team
    seed INTEGER NOT NULL, -- Predicted seed in the conference
    win_total INTEGER NOT NULL, -- Predicted total wins
    big_call TEXT, -- Big Call for the team
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of record creation
  )
`);

// Create NBA Player Awards table
database.run(`
  CREATE TABLE IF NOT EXISTS nba_player_awards_predictions (
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

// Save Eastern Conference predictions
app.post("/save-eastern-conference-predictions", (req, res) => {
  const { username, team_name, seed, win_total, big_call } = req.body;

  const query = `
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
    query,
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

// Save Western Conference predictions
app.post("/save-western-conference-predictions", (req, res) => {
  const { username, team_name, seed, win_total, big_call } = req.body;

  const query = `
    INSERT INTO western_conference_predictions (
      username,
      team_name,
      seed,
      win_total,
      big_call
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  database.run(
    query,
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

// Save Player Awards predictions
app.post("/save-player-awards-predictions", (req, res) => {
  const {
    username,
    most_valuable_player,
    rookie_of_the_year,
    defensive_player_of_the_year,
    most_improved_player,
    sixth_man_of_the_year,
    clutch_player_of_the_year,
  } = req.body;

  const query = `
    INSERT INTO nba_player_awards_predictions (
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
    query,
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

// Endpoint to fetch all NBA regular season predictions
app.get("/all-nba-regular-season-predictions", (req, res) => {
  const allPredictions = {};
  const queries = {
    easternConference: `SELECT * FROM eastern_conference_predictions`,
    westernConference: `SELECT * FROM western_conference_predictions`,
    playerAwards: `SELECT * FROM nba_player_awards_predictions`,
  };

  database.all(queries.playerAwards, [], (err, playerAwardsRows) => {
    if (err)
      return res
        .status(500)
        .send("❌ Error fetching Player Awards predictions!");
    allPredictions.playerAwards = playerAwardsRows;

    database.all(queries.easternConference, [], (err, eastRows) => {
      if (err)
        return res
          .status(500)
          .send("❌ Error fetching Eastern Conference predictions!");
      allPredictions.easternConference = eastRows;

      database.all(queries.westernConference, [], (err, westRows) => {
        if (err)
          return res
            .status(500)
            .send("❌ Error fetching Western Conference predictions!");
        allPredictions.westernConference = westRows;

        res.status(200).json(allPredictions);
      });
    });
  });
});

// Serve main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

// Serve static assets
app.use(express.static(path.join(__dirname, "html")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
