const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../util/db'); 

router.use(express.json()); 
router.use(express.urlencoded({ extended: false })); // URL 인코딩 미들웨어
router.use(cors());

module.exports = router;