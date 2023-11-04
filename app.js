const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const db = require('./util/db'); 
const app = express();
const port = 3000;
const postRouter = require('./router/post');

app.use('/posts', postRouter);
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cors());

app.get('/', (req, res) => {
    res.send('gogit');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
