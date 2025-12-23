import fs from "fs";
import csv from "csv-parser";
import pg from "pg";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function importCSV() {
  const client = await pool.connect();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Go UP one level from bin/ to the root, then DOWN into data/
  const csvFilePath = path.resolve(__dirname, "../data/races_data.csv");

  // Use the resolved path

  try {
    await client.query("BEGIN"); // Use a transaction for speed

    const stream = fs.createReadStream(csvFilePath).pipe(csv());

    for await (const row of stream) {
      const query = `
                INSERT INTO races_data (round, race_name, session, local_time, uk_time, latitude, longitude)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;

      // Clean the single quotes from the timestamp strings
      const cleanLocal = row["Local Time (YYYY-MM-DD HH:MI:SS+TZ)"].replace(
        /'/g,
        ""
      );
      const cleanUK = row["UK Time (YYYY-MM-DD HH:MI:SS+TZ)"].replace(/'/g, "");

      const values = [
        row.Round,
        row["Race Name"],
        row.Session,
        cleanLocal,
        cleanUK,
        row.Latitude,
        row.Longitude,
      ];

      console.log(
        `Inserting Round ${row.Round}: ${row["Race Name"]} (${row.Session})`
      );
      // console.table(values); 

      await client.query(query, values);
    }

    await client.query("COMMIT");
    console.log("Import successful!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Import failed, rolled back.", err);
  } finally {
    client.release();
    await pool.end();
  }
}

importCSV();
