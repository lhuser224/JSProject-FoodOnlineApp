const mysql = require('mysql2');
const path = require('path'); // THÊM DÒNG NÀY
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
console.log("DB User đang dùng:", process.env.DB_USER);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();