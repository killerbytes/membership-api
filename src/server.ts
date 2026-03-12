import "./config/env";
const PORT = Number(process.env.PORT) || 5000;
const HOST = "192.168.0.69";

import app from "./app";
import sequelize from "./config/database";
import { initAddressCache } from "./utils/locationCache";
import { loadModels } from "./utils/modelLoader";

import fs from "node:fs";
import https from "node:https";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await loadModels();
    await initAddressCache();

    await sequelize.sync({ alter: true });
    console.log("✅ Models synced");

    if (process.env.NODE_ENV === "production") {
      app.listen(PORT, () => {
        console.log(`✅ HTTP Server running on port ${PORT}`);
      });
    } else {
      const options = {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      };
      https.createServer(options, app).listen(PORT, HOST, () => {
        console.log(`✅ HTTPS Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

start();
