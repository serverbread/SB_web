'use strict'

const router = require('express').Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const SBLog = require('../SBLog.js')

const logger = new SBLog('error');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.all('/login', (req, res) => {
    let data = {
        error: false
    }

    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync('web/login.html'));

    } else if (req.method === 'POST') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        data.message = '登录账号的接口;'
        res.end(JSON.stringify(data));
        logger.debug(JSON.stringify(req.body));

    } else {
        data.error = true;
        data.message = 'what JB method!?';
        res.status(400).end(JSON.stringify(data));
    }
})

module.exports = router;