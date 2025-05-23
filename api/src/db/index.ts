import { config } from "dotenv";
import { createPool } from "mysql2/promise";
config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const port = Number(process.env.DB_PORT);

if (host === undefined) throw Error("DB_HOST is not defined in the api .env");
if (user === undefined) throw Error("DB_USER is not defined in the api .env");
if (password === undefined) throw Error("DB_PASSWORD is not defined in the api .env");
if (isNaN(port)) throw Error("DB_PORT is not defined in the api .env");

export const pool = createPool({
  host,
  user,
  password,
  port,
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  database: "inventory_tracker"
});
