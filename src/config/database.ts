import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate().then(() => {
  console.log("✅ Connection has been established successfully.");
});

export default sequelize;
