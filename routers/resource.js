'use strict'

const router = require('express').Router();
const fs = require('fs');
const SBLog = require('../SBLog.js');

const logger = new SBLog('error');

router.get('/file*', (req, res) => {
    try{
        const path = req.path.split('?')[0].slice(1);
        //logger.debug(`读取文件${path}`)
        // 判定路径是否为文件
        if (fs.lstatSync(path).isFile()) {
            res.setHeader("Cache-Control", "max-age=216000")   //10秒内重新发的请求都直接命中强缓存，无需向服务器发起请求，读取浏览器缓存即可
            // res.setHeader("Content-Type", "application/octet-stream")
            res.end(fs.readFileSync(path));
            return;
        } else {
            /*
            let fileList = [];
            fs.readdirSync(`${path}/`).forEach(file => {
                logger.debug(`file:${file}`)
                fileList.push({
                    name: file,
                    isFile: fs.lstatSync(`${path}/${file}`).isFile()
                });
            });
            res.end(JSON.stringify(fileList));
            */
           res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(fs.readFileSync('web/file_view.html'));
            return;
        }
    } catch (e) {
        logger.error(e);
        res.status(404).end('404 Not Found')
        logger.error('404 GOD DAMMIT');
    }
    
})

module.exports = router