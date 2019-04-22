var router = require("express").Router();
var sequelize = require("../db");
var User = sequelize.import("../models/user");
var Call = sequelize.import("../models/call");
const validateSession = require("../middleware/validate-session");

router.get("/", (req, res) => {
  Call.findAll()
    .then(calls => res.status(200).json(calls))
    .catch(err => res.status(500).json({ error: err }));
});

router.get("/getallbyowner", validateSession, function(req, res) {
  Call.findAll({
    where: { owner: req.user.id }
  }).then(
    function findAllSuccess(data) {
      res.json(data);
    },
    function findAllError(err) {
      res.send(500, err.message);
    }
  );
});

router.post("/", validateSession, function(req, res) {
  var owner = req.user.id;
  Call.create({
    grabber: req.body.call.grabber,
    description: req.body.call.description,
    duration: req.body.call.duration,
    owner: owner
  }).then(
    function createSuccess(call) {
      res.json({
        call: call
      });
    },
    function createError(err) {
      res.send(500, err.message);
    }
  );
});
router.put("/update/:id", validateSession, function(req, res) {
  var data = req.params.id;
  var userid = req.user.id;

  Call.update(req.body.call, { where: { id: data, owner: userid } }).then(
    function updateSuccess(updatedCall) {
      res.json(req.body);
    },
    function updateError(err) {
      res.send(500, err.message);
    }
  );
});
router.delete("/delete/:id", validateSession, (req, res) => {
  var data = req.params.id;
  var userid = req.user.id;

  Call.destroy({ where: { id: data, owner: userid } })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ error: err }));
});
module.exports = router;
