import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${env}` });
const config = require("../config/config.js")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize.authenticate().then(() => {
  console.log("✅ Connection has been established successfully.");
});

export default sequelize;
