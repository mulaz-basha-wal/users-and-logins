const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "westsidenode",
  password: "Mulaz@1093",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
