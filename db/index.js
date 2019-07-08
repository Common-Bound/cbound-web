const { Pool } = require("pg");
const pool = Pool({
  user: "eunsu",
  host: "localhost",
  database: "testDB",
  password: "",
  port: 5432
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback)
};
