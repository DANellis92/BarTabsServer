const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "bar-tabs-server",
  "postgres",
  process.env.PASS,
  {
    host: "localhost",
    dialect: "postgres"
  }
);

sequelize.authenticate().then(
  function() {
    console.log("TARGET LOCKED");
  },
  function(err) {
    console.log(err);
  }
);

module.exports = sequelize;
