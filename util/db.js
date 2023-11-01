const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'gogit'
});

module.exports = db;
