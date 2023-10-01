/*
* Server bread个人网站
* author:serverbread
*/
'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const SBLog = require('./SBLog.js');
//const exp = require('constants');
const YAML = require('yaml');

const logger = new SBLog('info')
const config = YAML.parse(fs.readFileSync('config.yml', 'utf-8'));

const cert = {
    key: fs.readFileSync(config.server.cert.private),
    cert: fs.readFileSync(config.server.cert.public)
}

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(cert, app);

app.use((req, res, next) => {
    // res.setHeader('Content-Type', 'charset=utf-8')
    logger.info(`${req.ip} ${req.method} ${req.url}`);   // 打印请求详情
    //logger.debug(`cookie:${req.cookies}`)
    
    if (req.protocol !== 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
});
app.use(require('body-parser').urlencoded({ extended: false }))
app.use(express.json())
app.use(require('cookie-parser')())

app.use(require('./routers/api.js'));
app.use(require('./routers/web.js'));
app.use(require('./routers/user.js'));
app.use(require('./routers/resource.js'));

httpServer.listen(config.server.httpPort, config.server.host, (logger.warn('服务器已启动')));
httpsServer.listen(config.server.httpsPort, config.server.host, (logger.warn('服务器已启动')))
