const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../util/db');

router.use(express.json());
router.use(express.urlencoded({ extended: false })); // URL 인코딩 미들웨어
router.use(cors());

router.post('/posts/:post_id/comments', (req, res) => {
    const param = [req.params.post_id, req.body.member_id, req.body.content];
    db.query(
        'INSERT INTO comment (post_id, member_id, content) VALUES (?, ?, ?)',
        param,
        (err, row) => {
            if (err) {
                res.status(400).json({ error: err });
            } else {
                res.status(201).json({ message: '댓글 추가 완료' });
            }
        }
    )
});

router.get('/posts/:post_id/comments', (req, res) => {
    db.query(
        'SELECT * FROM post WHERE id = ?',
        [req.params.post_id],
        (err, result) => {
            if (err) {
                res.status(400).json({ error: err });
            } else if (result.length === 0) {
                res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
            } else {
                db.query(
                    `SELECT comment.*, member.github_id, member.avatar_url, member.github_token, member.html_url 
                    FROM comment 
                    INNER JOIN member ON comment.member_id = member.id
                    WHERE post_id = ?`,
                    [req.params.post_id],
                    (err, results) => {
                        if (err) {
                            res.status(400).json({ error: err });
                        } else if (results.length === 0) {
                            res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
                        } else {
                            comments = results.map(result => {
                                return {
                                    id: result.id,
                                    content: result.content,
                                    author: {
                                        githubId: result.github_id,
                                        avatarUrl: result.avatar_url,
                                        githubToken: result.github_token,
                                        htmlUrl: result.html_url
                                    }
                                }
                            })
                            res.status(200).json(comments);
                        }
                    }
                )
            }
        }
    )

});


module.exports = router;