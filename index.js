require("dotenv").config();
var express = require("express");
var app = express();
var user = require("./controllers/usercontroller");
var call = require("./controllers/callcontroller");
var sequelize = require("./db");
var bodyParser = require("body-parser");

sequelize.sync();
app.use(bodyParser.json());
app.use(require("./middleware/headers"));

app.use("/user", user);
app.use("/call", call);

app.use(require("./middleware/validate-session"));

app.listen(process.env.PORT, function() {
  console.log(`App is listening on ${process.env.PORT}`);
});
