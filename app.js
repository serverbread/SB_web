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
const jwt = require('jsonwebtoken');

const logger = new SBLog('debug', true)
const config = YAML.parse(fs.readFileSync('config.yml', 'utf-8'));

logger.debug(JSON.stringify(config));

const cert = {
    key: fs.readFileSync(config.server.cert.private),
    cert: fs.readFileSync(config.server.cert.public)
}

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(cert, app);

app.use(require('body-parser').urlencoded({ extended: false }))
app.use(express.json())
app.use(require('cookie-parser')())

app.use((req, res, next) => {
    // res.setHeader('Content-Type', 'charset=utf-8')
    try{
        jwt.verify(req.cookies['sb_web-token'], config.server.jwtKey, (err, payload) => {
            logger.info(`\x1b[32m${config.option.showIP ? req.ip : ''}( ${payload.username} ) ${req.method} ${req.url} ${req.method === 'POST' ? JSON.stringify(req.body) : ''}\x1b[39m`);
            // logger.info(`\x1b[32m( ${payload.username} ) ${req.method} ${req.url}\x1b[39m`);
        })
    } catch (e) {
        logger.info(`${config.option.showIP ? req.ip : ''} ${req.method} ${req.url} ${req.method === 'POST' ? JSON.stringify(req.body) : ''}`);
        // logger.info(`${req.method} ${req.url}`);
    }

    if (req.protocol !== 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
});

app.use(require('./routers/api.js'));
app.use(require('./routers/web.js'));
app.use(require('./routers/user.js'));
app.use(require('./routers/resource.js'));

httpServer.listen(config.server.httpPort, config.server.host, (logger.info('http服务器已启动')));
httpsServer.listen(config.server.httpsPort, config.server.host, (logger.info('https服务器已启动')))
