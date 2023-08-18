import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw "No DATABASE_URL env var!  Have you made a .env file?  And set up dotenv?";
}
//async function
//await client.connect();
export const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
//await client.end();

//await client.connect();
//await client.end();
//do stuff
//await client.end();

//call function
