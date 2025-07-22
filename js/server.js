const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ Adjusted path to database from scripts/
const databaseFilePath = path.join(
  __dirname,
  "..",
  "data",
  "sporting-league-predictions.db"
);
const databaseConnection = new sqlite3.Database(databaseFilePath);

// ✅ Create prediction tables if they don't exist
const createPredictionTablesIfMissing = () => {
  databaseConnection.run(`
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

  databaseConnection.run(`
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

  databaseConnection.run(`
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

createPredictionTablesIfMissing();

// ✅ Save predictions
app.post("/save-all-nba-regular-season-predictions", (req, res) => {
  const {
    username,
    easternConference: easternConferencePredictions,
    westernConference: westernConferencePredictions,
    playerAwards,
  } = req.body;

  const insertEastern = databaseConnection.prepare(`
    INSERT INTO eastern_conference_predictions (username, team_name, seed, win_total, big_call)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertWestern = databaseConnection.prepare(`
    INSERT INTO western_conference_predictions (username, team_name, seed, win_total, big_call)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertAwards = databaseConnection.prepare(`
    INSERT INTO nba_player_awards_predictions (
      username, most_valuable_player, rookie_of_the_year,
      defensive_player_of_the_year, most_improved_player,
      sixth_man_of_the_year, clutch_player_of_the_year
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  databaseConnection.serialize(() => {
    try {
      easternConferencePredictions.forEach((team) => {
        insertEastern.run(
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null
        );
      });

      westernConferencePredictions.forEach((team) => {
        insertWestern.run(
          username,
          team.team_name,
          team.seed,
          team.win_total,
          team.big_call || null
        );
      });

      insertAwards.run(
        username,
        playerAwards.most_valuable_player,
        playerAwards.rookie_of_the_year,
        playerAwards.defensive_player_of_the_year,
        playerAwards.most_improved_player,
        playerAwards.sixth_man_of_the_year,
        playerAwards.clutch_player_of_the_year
      );

      insertEastern.finalize();
      insertWestern.finalize();
      insertAwards.finalize();

      res
        .status(200)
        .json({ message: "All predictions submitted successfully!" });
    } catch (error) {
      console.error("❌ Error inserting predictions:", error);
      res.status(500).send("Failed to submit predictions.");
    }
  });
});

// ✅ Fetch predictions
app.get("/get-all-nba-regular-season-predictions", (req, res) => {
  const predictionsResponse = {};

  databaseConnection.all(
    "SELECT * FROM nba_player_awards_predictions",
    [],
    (err, awardsRows) => {
      if (err)
        return res
          .status(500)
          .send("Error fetching Player Awards predictions.");
      predictionsResponse.playerAwards = awardsRows;

      databaseConnection.all(
        "SELECT * FROM eastern_conference_predictions",
        [],
        (err, eastRows) => {
          if (err)
            return res
              .status(500)
              .send("Error fetching Eastern Conference predictions.");
          predictionsResponse.easternConference = eastRows;

          databaseConnection.all(
            "SELECT * FROM western_conference_predictions",
            [],
            (err, westRows) => {
              if (err)
                return res
                  .status(500)
                  .send("Error fetching Western Conference predictions.");
              predictionsResponse.westernConference = westRows;

              res.status(200).json(predictionsResponse);
            }
          );
        }
      );
    }
  );
});

// ✅ Serve static frontend files (adjusted for scripts/ location)
app.use(express.static(path.join(__dirname, "..", "html")));
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "html", "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
