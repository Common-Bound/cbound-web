const { Pool } = require("pg");
const pool = Pool({
  user: "maeaws19021",
  host: "dal-rds-postgre-sql.cqtxgsqti0jh.ap-northeast-2.rds.amazonaws.com",
  database: "postgres",
  password: "X'W0!7lv83aO",
  port: 5432
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback)
};
