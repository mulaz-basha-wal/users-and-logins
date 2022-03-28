var express = require("express");
var router = express.Router();

router.get("/setsession/:name/:value", (req, res) => {
  req.session[req.params.name] = req.params.value;
  res.send(
    `session with name as ${req.params.name} and value as ${req.params.value} is set`
  );
});
router.get("/user/:username", (req, res) => {
  req.session.userName = req.params.username;
  res.send("");
});
router.get("delete/:name", (req, res) => {
  delete req.session[req.params.name];
  res.send(`deleted ${req.params.name}`);
});
router.get("/destroy", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.send("error while deleting session");
    } else {
      res.send("Complete session destroyed.");
    }
  });
});
module.exports = router;
