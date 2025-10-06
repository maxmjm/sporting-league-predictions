require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // ok for hosted PG like Render
});

async function main() {
  console.log("Starting Postgres cleanup…");
  try {
    await pool.query("BEGIN");

    // TRUNCATE resets SERIAL/IDENTITY counters automatically with RESTART IDENTITY
    await pool.query(`
      TRUNCATE TABLE
        eastern_conference_predictions,
        western_conference_predictions,
        nba_player_awards_predictions
      RESTART IDENTITY
    `);

    await pool.query("COMMIT");
    console.log("✅ Tables truncated and IDs reset.");
  } catch (err) {
    await pool.query("ROLLBACK").catch(() => {});
    console.error("❌ Cleanup failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
