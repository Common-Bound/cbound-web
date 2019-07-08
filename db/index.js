const { Pool } = require("pg");
const pool = Pool({
  user: "eunsu",
  host: "localhost",
  database: "testDB",
  password: "",
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
