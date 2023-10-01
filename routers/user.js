'use strict'

const router = require('express').Router();
//const bodyParser = require('body-parser');
const fs = require('fs');
const SBLog = require('../SBLog.js')
const jwt = require('jsonwebtoken')
const YAML = require('yaml');

const config = YAML.parse(fs.readFileSync('config.yml', 'utf-8')); // 配置文件
const logger = new SBLog('debug');

// client.on('error', err => logger.error(err))

router.all('/login', (req, res) => {
    
    let data = {
        error: false
    }
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync('web/login.html'));

    } else if (req.method === 'POST') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        
        const { username, password } = req.body;
        if (username === 'xiaym' && password === '114514') {
            jwt.sign(
                { username },
                config.server.jwtKey,
                { expiresIn: '10m' },
                (err, token) => {
                    data.message = '登录成功'
                    logger.debug(token);
                    data.token = token;
                    res.setHeader('Set-Cookie', `sb_web-token=${token}`);  //设置cookie
                    res.end(JSON.stringify(data));
                }
            );
        } else {
            data.message = '账号或密码错误，请仔细检查';
            res.end(JSON.stringify(data));
        }
        //logger.debug(JSON.stringify(req.body));

    } else {
        data.error = true;
        data.message = 'what JB method!?';
        res.status(400).end(JSON.stringify(data));
    }
})

module.exports = router;