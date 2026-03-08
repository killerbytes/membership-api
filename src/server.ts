import dotenv from "dotenv";
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const PORT = 3000;
const HOST = "192.168.0.69";

import app from "./app";
import sequelize from "./config/database";
import { loadModels } from "./utils/modelLoader";

import fs from "node:fs";
import https from "node:https";

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Initialize associations dynamically
    await loadModels();

    await sequelize.sync({ alter: true });

    console.log("Models synced");

    https.createServer(options, app).listen(PORT, HOST, () => {
      console.log(`HTTPS Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();
