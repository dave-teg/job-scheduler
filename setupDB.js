import fs from "fs";
import pool from "./src/db.js";

const schema = fs.readFileSync("schema.sql", "utf8");

async function setupDatabase() {
  try {
    await pool.query(schema);
    console.log(" Database schema applied successfully");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    pool.end(); // Close the connection
  }
}

setupDatabase();
