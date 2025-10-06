require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await pool.query("BEGIN");

    // 1) Drop old tables if they exist
    await pool.query(`
      DROP TABLE IF EXISTS
        eastern_conference_predictions,
        western_conference_predictions,
        nba_player_awards_predictions
      CASCADE;
    `);

    // 2) Recreate under your preferred names/schemas
    await pool.query(`
      CREATE TABLE nba_east_predictions (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        team_name TEXT NOT NULL,
        seed INTEGER,
        win_total INTEGER,
        big_call TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE nba_west_predictions (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        team_name TEXT NOT NULL,
        seed INTEGER,
        win_total INTEGER,
        big_call TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE nba_awards_predictions (
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

    await pool.query("COMMIT");
    console.log("✅ Hard reset complete.");
  } catch (e) {
    await pool.query("ROLLBACK").catch(() => {});
    console.error("❌ Hard reset failed:", e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
