const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const db = require('./util/db'); 
const app = express();
const port = 3000;

app.use(express.json()); // JSON 파싱을 위한 미들웨어
app.use(express.urlencoded({ extended: false })); // URL 인코딩 미들웨어
app.use(cors());

app.get('/', (req, res) => {
    res.send('gogit');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
