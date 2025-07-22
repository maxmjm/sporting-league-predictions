const sqlite3 = require("sqlite3");
const path = require("path");

// --- Config ---
const DB_PATH = path.join(
  __dirname,
  "..",
  "data",
  "sporting-league-predictions.db"
);

// List of tables to wipe clean
const TABLES_TO_CLEAR = [
  "eastern_conference_predictions",
  "western_conference_predictions",
  "nba_player_awards_predictions",
  // Add more tables (e.g., AFL, World Cup) here
];

// --- Main Execution Function ---
function main() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Failed to connect to database:", err.message);
      process.exit(1);
    }
  });

  console.log("Starting predictions data clearing process...");

  db.serialize(() => {
    // Clear all specified tables
    TABLES_TO_CLEAR.forEach((table) => {
      db.run(`DELETE FROM ${table}`, (err) => {
        if (err) {
          console.error(`Error clearing table "${table}":`, err.message);
        } else {
          console.log(`Cleared data from "${table}"`);
        }
      });
    });

    // Reset the AUTOINCREMENT sequence for affected tables
    const placeholders = TABLES_TO_CLEAR.map(() => "?").join(", ");
    db.run(
      `DELETE FROM sqlite_sequence WHERE name IN (${placeholders})`,
      TABLES_TO_CLEAR,
      (err) => {
        if (err) {
          console.warn("Could not reset auto-increment counters:", err.message);
        } else {
          console.log("Auto-increment counters reset.");
        }
      }
    );
  });

  // Close database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed. Cleanup complete!");
    }
  });
}

main();
