var express = require("express");
var router = express.Router();
const connector = require("../poolconnect");

router.get("/createtable", (req, res) => {
  connector.query(
    "CREATE TABLE users (id INT, username VARCHAR(25), password VARCHAR(100), date_of_creation DATE);",
    (err, results) => {
      res.json({ err, results });
    }
  );
});

router.post("/", (req, res) => {
  const { id, username, password } = req.body;
  connector.query("SELECT * FROM users", (error, result) => {
    if (error === null) {
      result.forEach((user) => {
        if (user.username === username) {
          res.json({ status: 0, debug_data: "username already exists" });
        }
      });
      const sql = "INSERT INTO users VALUES(?,?,?,?)";
      connector.query(
        sql,
        [id, username, password, new Date().toISOString().slice(0, 10)],
        (error, result) => {
          if (error === null) {
            res.json({ status: 1, data: "user created" });
          } else {
            res.json({
              message: "Error while creating user. try again",
              error,
            });
          }
        }
      );
    } else {
      res.json({
        message: "Error while loading users to check user existance",
      });
    }
  });
});

router.get("/", (req, res) => {
  const sql = "select * from users";
  connector.query(sql, (error, result) => {
    res.json({ error, result });
  });
});

router.put("/:id", (req, res) => {
  const { username, password, date_of_creation } = req.body;
  const sql = `update users set username=?, password=?, date_of_creation=? where id="${req.params.id}";`;
  connector.query(
    sql,
    [username, password, date_of_creation],
    (error, result) => {
      res.json({ error, result });
    }
  );
});

router.delete("/:id", (req, res) => {
  const sql = `delete from users where id="${req.params.id}";`;
  connector.query(sql, (error, result) => {
    res.json({ error, result });
  });
});

router.delete("/delete/all", (req, res) => {
  const sql = "truncate table users";
  connector.query(sql, (error, result) => {
    res.json({ error, result });
  });
});

router.get("/checklogin", (req, res) => {
  const { username, password } = req.body;
  let flag = false;
  connector.query("SELECT * FROM users", (error, result) => {
    result.forEach((user) => {
      if (user.username === username && user.password === password) {
        flag = true;
      }
    });
    if (flag) {
      req.session["isLoggedIn"] = 1;
      req.session["username"] = username;
      res.json({ status: 1, data: username });
    } else {
      req.session["isLoggedIn"] = 0;
      res.json({ status: 0, data: "incorrect login details" });
    }
  });
});

router.get("/loggeduser", (req, res) => {
  if (req.session.isLoggedIn === 1) {
    const sql = "SELECT * FROM users where username=?;";
    connector.query(sql, [req.session.username], (error, result) => {
      res.json({ error, result });
    });
  } else {
    res.json({ status: 0, debug_data: "you are not logged in " });
  }
});
module.exports = router;
