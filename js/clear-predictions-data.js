const sqlite3 = require("sqlite3");
const path = require("path");

// Path to your database file
const databaseFilePath = path.join(
  __dirname,
  "..",
  "data",
  "sporting-league-predictions.db"
);
const databaseConnection = new sqlite3.Database(databaseFilePath);

// Tables to clear – extend this list as needed
const predictionTablesToClear = [
  "eastern_conference_predictions",
  "western_conference_predictions",
  "nba_player_awards_predictions",
  // add AFL, World Cup, etc. tables here when needed
];

console.log("🔄 Starting predictions data clearing process...");

databaseConnection.serialize(() => {
  predictionTablesToClear.forEach((tableName) => {
    databaseConnection.run(`DELETE FROM ${tableName}`, (error) => {
      if (error) {
        console.error(
          `❌ Failed to clear data from table "${tableName}":`,
          error.message
        );
      } else {
        console.log(`✅ Data cleared from table "${tableName}"`);
      }
    });
  });

  // Reset auto-increment counters
  databaseConnection.run(
    `DELETE FROM sqlite_sequence WHERE name IN (${predictionTablesToClear
      .map(() => "?")
      .join(", ")})`,
    predictionTablesToClear,
    (error) => {
      if (error) {
        console.warn(
          "⚠️ Failed to reset auto-increment counters:",
          error.message
        );
      } else {
        console.log("🔁 Auto-increment counters reset for cleared tables.");
      }
    }
  );
});

databaseConnection.close(() => {
  console.log(
    "✅ Database connection closed. Predictions data cleanup complete."
  );
});
