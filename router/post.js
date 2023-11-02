const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../util/db'); 
const { default: axios } = require('axios');

router.use(express.json()); 
router.use(express.urlencoded({ extended: false })); // URL 인코딩 미들웨어
router.use(cors());

router.get('/', (req, res) => {
    db.query(
        'SELECT * FROM post', 
        (selectPostError, posts) => {
        if (selectPostError) {
            res.json(selectPostError);
        } else {
            res.json(posts);
        }
    });
});




module.exports = router;