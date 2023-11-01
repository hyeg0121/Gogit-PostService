const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'gogit'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ' + err.stack);
    return;
  }
  console.log('MySQL 연결 성공');
});

module.exports = db;
