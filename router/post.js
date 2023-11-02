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

router.post('/', (req, res) => {
    const param = [req.body.writer, req.body.contents];
    db.query(
        'INSERT INTO post (member_id, created_at, contents) VALUE (?, now(), ?)',
        param,
        (error, row) => {
            if (error) {
                console.error(error);
            } else {
                res.json({
                    "member_id": param[0],
                    "content": param[1]
                });
            }
        }
    )   
});

router.get('/member/:member_no', (req, res) => {
    const memberNo = req.params.member_no;

    db.query(
        'SELECT * FROM post WHERE member_id = ?',
        [memberNo],
        (error, posts) => {
            if (error) {    
                console.log(error);
                res.json(error);
            } else {
                res.json({posts});
            }

        }
    );
});


module.exports = router;