'use strict'

const router = require('express').Router();
//const bodyParser = require('body-parser');
const fs = require('fs');
const SBLog = require('../SBLog.js')
const jwt = require('jsonwebtoken')
const YAML = require('yaml');
const sqlite3 = require('sqlite3');

const config = YAML.parse(fs.readFileSync('config.yml', 'utf-8')); // 配置文件
const logger = new SBLog('info');
const db = new sqlite3.Database(config.database.sqlite.path, err => logger.error(err));

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
        
        const { username, password } = req.body;  // 获取post请求的数据

        // 使用数据库获取数据
        db.get(`SELECT * FROM USERDATA WHERE id == '${username}'`, (err, row) => {
            // 检测用户名是否正确
            if (!row) {
                logger.error('查无此人');
                data.error = true;
                data.message = '登录失败！请检查用户名与密码是否正确！'
                res.end(JSON.stringify(data));
                return;
            }
            logger.info(`成功从数据库中找到了${username}！`);
            // 检测密码是否正确
            if (row.password != password) {
                data.error = true;
                data.message = '登录失败！请检查用户名与密码是否正确！'
                res.end(JSON.stringify(data));
                logger.error(`${username}的密码错误！`);
                return;
            }
            logger.info(`${username}的密码正确！`);
            // 使用jwt签名
            jwt.sign(
                { username },
                config.server.jwtKey,
                { expiresIn: config.server.jwtKeyTimeout },
                (err, token) => {
                    data.message = '登录成功'
                    logger.info(`JWT签名成功！${token}`);
                    data.token = token;
                    res.setHeader('Set-Cookie', `sb_web-token=${token}`);  //设置cookie
                    res.end(JSON.stringify(data));
                }
            );
        })

    } else {
        data.error = true;
        data.message = 'what JB method!?';
        res.status(400).end(JSON.stringify(data));
    }
})

router.all('/register', (req, res) => {
    res.end(fs.readFileSync('web/register.html'));
    return;
})

module.exports = router;