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
      'SELECT post.*, member.* FROM post INNER JOIN member ON post.member_id = member.id',
      (error, posts) => {
        if (error) {
          res.status(500).json({ error: '게시물을 불러오는 중 오류가 발생했습니다.' });
        } else {
          const modifiedPosts = posts.map(post => {
            return {
              id: post.id,
              contents: post.contents,
              createdAt: post.created_at,
              writer: {
                id: post.id, 
                githubId: post.github_id,
                avatarUrl: post.avatar_url, 
                githubToken: post.github_token,
                htmlUrl: post.html_url
              }
            };
          });
          res.status(200).json(modifiedPosts);
        }
      }
    );
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
        'SELECT post.*, member.* FROM post INNER JOIN member ON post.member_id = member.id WHERE member.id = ?',
        [memberNo],
        (error, posts) => {
            if (error) {
                res.status(500).json({ error: '게시물을 불러오는 중 오류가 발생했습니다.' });
            } else {
                const modifiedPosts = posts.map(post => {
                  return {
                    id: post.id,
                    contents: post.contents,
                    createdAt: post.created_at,
                    writer: {
                      id: post.id, 
                      githubId: post.github_id,
                      avatarUrl: post.avatar_url, 
                      githubToken: post.github_token,
                      htmlUrl: post.html_url
                    }
                  };
                });
                res.status(200).json(modifiedPosts);
            }
        }
    );
});


module.exports = router;