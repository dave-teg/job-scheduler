import pool from "./src/db.js";

async function checkTables() {
  try {
    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log("Tables:", res.rows);
  } catch (err) {
    console.error("❌ Error fetching tables:", err);
  } finally {
    pool.end();
  }
}

checkTables();
