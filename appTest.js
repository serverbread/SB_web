#!/bin/env node
/*
* Server bread个人网站
* author:serverbread
*/
'use strict';

const express = require('express');
const http = require('http');
const SBLog = require('./SBLog.js');
const { log } = require('console');

const logger = new SBLog('info', false);

/*const cert = {
    key: fs.readFileSync('/etc/ssl/certs/dashabi.key'),
    cert: fs.readFileSync('/etc/ssl/certs/dashabi.pem')
}
*/
const app = express();
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(/*cert, */app);

app.use((req, res, next) => {
    // res.setHeader('Content-Type', 'charset=utf-8')
    logger.info(`${req.ip} ${req.method} ${req.url}`);   // 打印请求详情
    //logger.debug(`cookie:${req.cookies}`)
    /*
    if (req.protocol !== 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }*/
    next();
});
app.use(require('./routers/api.js'));
app.use(require('./routers/web.js'));
app.use(require('./routers/user.js'));
app.use(require('./routers/resource.js'));

httpServer.listen(5500, '0.0.0.0', (logger.warn('服务器已启动')));

setTimeout(() => {
    logger.error('测试时间到了，关服跑路');
    process.exit(0);
}, 3600);

process.on('SIGTERM',()=>{
    // close server
    httpServer.close(()=>{
        logger.error('收到SIGTERM，正在准备关服跑路！');
    });
})
//httpsServer.listen(8443, '0.0.0.0', (logger.warn('服务器已启动')))
