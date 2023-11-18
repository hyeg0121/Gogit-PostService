const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../util/db');

router.use(express.json());
router.use(express.urlencoded({extended: false})); // URL 인코딩 미들웨어
router.use(cors());

router.get('/posts', (req, res) => {
    db.query(
        'SELECT post.*, member.github_id, member.avatar_url, member.github_token, member.html_url FROM post INNER JOIN member ON post.member_id = member.id ORDER BY post.created_at DESC',
        (error, posts) => {
            if (error) {
                res.status(400).json({error: '게시물을 불러오는 중 오류가 발생했습니다.'});
            } else {
                const modifiedPosts = posts.map(post => {
                    return {
                        id: post.id,
                        content: post.content,
                        createdAt: post.created_at,
                        writer: {
                            githubId: post.github_id,
                            avatarUrl: post.avatar_url,
                            githubToken: post.github_token,
                            htmlUrl: post.html_url
                        },
                        commentCount: 0
                    };
                });
                res.status(200).json(modifiedPosts);
            }
        }
    );
});

router.post('/posts', (req, res) => {
    const param = [req.body.writer, req.body.content];
    db.query(
        'INSERT INTO post (member_id, created_at, content) VALUE (?, now(), ?)',
        param,
        (error, row) => {
            if (error) {
                console.log(error);
                res.status(400).json({error: error})
            } else {
                res.status(201).json({
                    "member_id": param[0],
                    "content": param[1]
                });
            }
        }
    )
});


router.get('/members/:member_no/posts', (req, res) => {
    const memberNo = req.params.member_no;

    db.query(
        `SELECT post.*, member.github_id, member.avatar_url, member.github_token, member.html_url
         FROM post
                  INNER JOIN member ON post.member_id = member.id
         WHERE member.id = ?
         ORDER BY post.created_at DESC`,
        [memberNo],
        (error, posts) => {
            if (error) {
                res.status(500).json({error: '게시물을 불러오는 중 오류가 발생했습니다.'});
            } else {
                const modifiedPosts = posts.map(post => {

                    console.log(post);
                    return {
                        id: post.id,
                        content: post.content,
                        createdAt: post.created_at,
                        writer: {
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

router.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    db.query(
        `SELECT post.*, member.github_id, member.avatar_url, member.github_token, member.html_url
         FROM post
         INNER JOIN member ON post.member_id = member.id
         WHERE post.id = ?`,
        [id],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: err});
            } else if (results.length === 0) {
                res.status(404).json({message: '글을 찾을 수 없습니다.'})
            } else {
                const result = results[0];
                const post = {
                    id: result.id,
                    content: result.content,
                    createdAt: result.created_at,
                    writer: {
                        githubId: result.github_id,
                        avatarUrl: result.avatar_url,
                        githubToken: result.github_token,
                        htmlUrl: result.html_url
                    }
                };
                res.status(200).json(post);
            }
        }
    )
})


module.exports = router;