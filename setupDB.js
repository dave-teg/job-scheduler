import fs from "fs";
import pool from "./src/db.js";

const schema = fs.readFileSync("schema.sql", "utf8");

export async function setupDatabase() {
  try {
    // Check if the schema has already been applied
    const result = await pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users');"
    );
    if (result.rows[0].exists) {
      // console.log("Database schema already exists. Skipping setup.");
      return;
    }

    await pool.query(schema);
    console.log(" Database schema applied successfully");

  } catch (err) {
    console.error("Error setting up database:", err);

  } finally {
    pool.end(); // Close the connection
  }
}

