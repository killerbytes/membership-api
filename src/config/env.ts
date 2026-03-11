import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
const envPath = `.env.${env}`;

dotenv.config({ path: envPath });

dotenv.config();

console.log(`🌍 Loaded environment: ${env}`);
