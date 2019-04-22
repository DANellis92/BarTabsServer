var express = require("express");
var router = express.Router();
var sequelize = require("../db");
var User = sequelize.import("../models/user");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

router.post("/", function(req, res) {
  var username = req.body.user.username;
  var pass = req.body.user.passwordhash;

  User.create({
    username: username,
    passwordhash: bcrypt.hashSync(pass, 10)
  }).then(
    function createSuccess(user) {
      var token = jwt.sign(
        {
          id: user.id
        },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 }
      );
      res.json({
        user: user,
        message: "created",
        sessionToken: token
      });
    },
    function createError(err) {
      res.send(500, err.message);
    }
  );
});

router.post("/login", function(req, res) {
  User.findOne({ where: { username: req.body.user.username } }).then(
    function(user) {
      if (user) {
        bcrypt.compare(req.body.user.passwordhash, user.passwordhash, function(
          err,
          matches
        ) {
          if (matches) {
            var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24
            });
            res.json({
              user: user,
              message: "successfully authenticated",
              sessionToken: token
            });
          } else {
            res.status(502).send({ error: "Authentication failure" });
          }
        });
      } else {
        res.status(500).send({ error: "Authentication failure" });
      }
    },
    function(err) {
      res.status(501).send({ error: "Authentication failure" });
    }
  );
});

module.exports = router;
