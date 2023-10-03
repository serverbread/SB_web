// 处理页面的路由
const fs = require('fs');
const querystring = require('querystring');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const SBLog = require('../SBLog.js');
const YAML = require('yaml');

const logger = new SBLog('info' ,true);
const config = YAML.parse(fs.readFileSync('config.yml', 'utf-8'));
/*
router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    next();
});
*/
router.get('/api', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    let data = {
        error: false
    };  // 初始化返回数据
    data.message = '如何使用api接口？\
    注意，每一个向/api请求的url都必须含有一个method参数\
    他可以为:\
    coffee,get\
    ';
    res.end(JSON.stringify(data));
})
/*
router.all('/api*', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); // 设置请求头，确认要返回的是JSON
})
*/

router.get('/api/passage', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    const arg  = req.url.split('?')[1]

    let data = {
        error: false
    }
    if (!arg) {
        data.error = true;
        data.message = 'arg is undefined!';
        logger.error('客户端未提供参数！');
        res.end(JSON.stringify(data))
    } else {
        // 所有逻辑在这开始
        switch (querystring.parse(arg).method) {
            case 'get':
                logger.info('客户端请求获取文章');
                switch (querystring.parse(arg).detail) {
                    case 'list':
                        logger.info('客户端请求获取文章列表');

                        data.files = [];
                        fs.readdirSync('passages/').forEach(file => {
                            data.files.push(file);
                        });
                        res.end(JSON.stringify(data));
                        return;

                    case 'latest':
                        logger.info('客户端请求获取最新文章');

                        data.file = fs.readdirSync('passages/').sort((a, b) => {
                            return fs.statSync('passages/' + a).ctime - fs.statSync('passages/' + b).ctime;
                        }).pop();
                        res.end(JSON.stringify(data));
                        return;
                }
                data.message = 'no detail, please look at /';
                res.end(JSON.stringify(data));
                return;
            case 'data':
                try{
                    data.data = fs.readFileSync('passages/' + querystring.parse(arg).detail).toString();
                } catch (e) {
                    logger.error(e);
                    data.error = true;
                    data.message = 'no detail, please look at/';
                    res.end(JSON.stringify(data));
                    return;
                };
                res.end(JSON.stringify(data));
                return
            };
        data.error = true;
        data.messgae = 'no method, please look at /';
        res.end(JSON.stringify(data));
    }
})

router.get('/api/file', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    /*
    客户端需要提供一个参数：path
    */
    const arg  = req.url.split('?')[1];
    //logger.debug('客户端获取文件列表');
    let data = {
        error: false
    };
    if (!arg) {
        data.error = true;
        data.message = 'arg is undefined!';
        logger.error('客户端未提供参数！');
        res.end(JSON.stringify(data));
        return;
    } else if (!querystring.parse(arg).path) {
        data.error = true;
        data.message = 'no path!';
        logger.error('这b客户端不给path啊');
        res.end(JSON.stringify(data));
        return;
    } else {
        let fileList = [];
        const path = querystring.parse(arg).path
        try {
            fs.readdirSync(`${path}/`).forEach(file => {
                // logger.debug(`file:${file}`)
                fileList.push({
                    name: file,
                    isFile: fs.lstatSync(`${path}/${file}`).isFile(),
                    path: `${path}/${file}`,
                    size: `${fs.statSync(`${path}/${file}`).size}`
                });
            });
            res.end(JSON.stringify(fileList));
            return;
        } catch (e) {
            data.error = true;
            data.message = 'I can\'t found the resource, your problem.'
            res.status(404).end(JSON.stringify(data));
        }
    }
})

router.get('/api/login-status', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    // logger.error(`用户cookie：${req.cookies['sb_web-token']}`)
    let data = {
        error: false
    };
    jwt.verify(req.cookies['sb_web-token'], config.server.jwtKey, (err, payload) => {
        if (err) {
            logger.error(err);
            data.error = true;
            data.message = `验证失败，闻起来像${err}`
            return;
        }
        data.message = '成功登录'
        logger.debug(`负载：${JSON.stringify(payload)}`);
    })
    // data.message = `你的token：${req.cookies['sb_web-token']}`
    res.end(JSON.stringify(data));
})

router.get('/api/random-nsfw', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    const arg  = req.url.split('?')[1]

    let data = {
        error: false
    };
    if (!arg) {
        data.error = true;
        data.message = 'arg is undefined!';
        logger.error('客户端未提供参数！');
        res.end(JSON.stringify(data))
        return;
    }

    const type = arg.type;
    data.type = type;
    data.message = '获取涩图的接口';
    res.end(JSON.stringify(data));
})

module.exports = router;