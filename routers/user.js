'use strict'

const router = require('express').Router();
//const bodyParser = require('body-parser');
const fs = require('fs');
const SBLog = require('../SBLog.js');
const jwt = require('jsonwebtoken');
const YAML = require('yaml');
const sqlite3 = require('sqlite3');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const config = require('../config.js'); // 配置文件
const logger = new SBLog('debug');
const userDb = new sqlite3.Database(config.database.sqlite.userDatabase, err => logger.error(err));
const regDb = new sqlite3.Database(config.database.sqlite.registerDatabase, err => logger.error(err));
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
        userDb.get(`SELECT * FROM USERDATA WHERE id == '${username}'`, (err, row) => {
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
            if (row.password != crypto.createHash('sha512').update(password).digest('base64')) {
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
});

router.all('/register', (req, res) => {
    let data = {
        error: false
    }

    if (req.method === 'GET') {
        res.end(fs.readFileSync('web/register.html'));
        return;
    } else if (req.method === 'POST') {
        const { user, pass } = config.server.mail.smtpUser;  // 获取邮箱用户的密码与授权秘钥
        const { host, port, secure } = config.server.mail.smtpServer;  // 获取邮箱服务器的信息
        const { username, email, password } = req.body;

        let isCancelled = false;

        if (!/^[a-zA-Z0-9_-]{4,16}$/.test(username) ||
            !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
            isCancelled = true;
            data.error = true;
            data.message = '信息不规范，查看用户名，邮箱的输入是否合法'
            res.end(JSON.stringify(data));
            return;
        }

            regDb.all(`SELECT * FROM register`, (err, row) => {
                if (err) logger.error(err);
                if (isCancelled) return;
                // 检测用户名、邮箱事后已被占用
                for (let i in row) {
                    //logger.debug(JSON.stringify(row[i]));
                    if (row[i].email === email || row[i].id === username) {
                        logger.debug(`邮箱同名${row[i].email === email} 用户同名${row[i].id === username}`)
                        data.error = true;
                        data.message = row[i].id !== username ? '你已经用这个邮箱发送过注册请求了！害不害躁啊！' : '用户名已被占用！';
                        res.end(JSON.stringify(data));
                        return;
                    }
                }

                // 将数据写入数据库
                const captcha = crypto.randomUUID();
                const sql = `INSERT INTO register ( UUID, email, id, password )
                                                VALUES
                                                ( '${captcha}', '${email}', '${username}', '${crypto.createHash('sha512').update(password).digest('base64')}' );`
                regDb.run(sql, err => {
                    if (err) logger.error(err);
    
                    // 发送验证码邮件
                    nodemailer.createTransport({
                        host: host,  // 第三方邮箱的主机地址
                        port: port,
                        secure: secure,  // true for 465, false for other ports
                        auth: {
                            user: user,  // 发送方邮箱的账号
                            pass: pass,  // 邮箱授权密码
                        },
                    }).sendMail({
                        from: '"😡SB网站的注册确认挑战书😡" <serverbread@163.com>', // 发送方邮箱的账号
                        to: email, // 邮箱接受者的账号
                        subject: "wElCoMe", // Subject line
                        html: `<button><a href="https://dashabi.stehp.cn/captcha/${captcha}">点击此处验证你的邮箱</a></button>`, // html 内容, 如果设置了html内容, 将忽略text内容
                    });
                })
                data.message = '验证码已发送，请查收邮箱！';
                res.end(JSON.stringify(data));
                //logger.debug(JSON.stringify(row));
                return;
            })
            
    } else {
        data.error = true;
        data.message = 'what JB method!?';
        res.status(400).end(JSON.stringify(data));
    }
});

router.get('/captcha/*', (req, res) => {
    const captcha = req.path.split('/captcha/')[1];
    logger.debug(captcha);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')

    regDb.get(`SELECT * FROM register WHERE UUID == '${captcha}'`, (err, row) => {
        if (err) logger.error(err);
        if (!row) {
            logger.error('错误的，未查询到信息');
            res.status(400).write('傻逼');
            return;
        }
        const sql = `INSERT INTO userData ( id, email, password )
                                            VALUES
                                            ( '${row.id}', '${row.email}', '${row.password}' );`;
        userDb.run(sql, err => {
            if (err) logger.error(err);
            res.end('验证成功！请到/login登录账号');
        })
        
    })
    //res.end(code);
    return;
})

module.exports = router;