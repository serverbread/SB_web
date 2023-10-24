'use strict'

const router = require('express').Router();
const fs = require('fs');
const SBLog = require('../SBLog.js');
const path = require('path');

const logger = new SBLog('debug', true, __filename);
const config = require('../config.js');

path.parent = (currentPath) => {
    // 返回输入路径的父目录的函数
    const tmp = currentPath.split('/');   //将其转换为形如 ['', 'file', 'homework_resource', 'sb'] 的格式
    tmp.pop();   // 去除最后一个元素： ['', 'file', 'homework_resource']
    return tmp.toString().replaceAll(',', '/');
}

// router.use(require('cookie-parser')());
router.get('/file*', (req, res) => {
    
    try{
        const reqPath = decodeURIComponent(req.path.split('?')[0].slice(1));
        // 判定路径是否为文件
        let tmpPath = fs.lstatSync(reqPath).isFile() ? path.dirname(reqPath) : reqPath;
        logger.debug(tmpPath);
        while (tmpPath !== 'file' && tmpPath !== 'file/') {
            logger.info('子目录情况命中')
            if (fs.existsSync(`${tmpPath}/.lock`)) {
                if (!req.isLogin) {
                    // 403
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		    const desc = fs.readFileSync(`${tmpPath}/.lock`).toString();
                    res.status(403).end(`该${fs.lstatSync(reqPath).isFile() ? '文件' : '目录'}被锁定了，请登录后查看，原因：${desc}`);
                    logger.info('用户尝试访问一个锁定的文件夹，但是他没有登录');
                    return;
                };
                break;
            } else {
                // 设置到上层路径
                tmpPath = path.parent(tmpPath);
                logger.debug('遍历上层目录')
            }
        }
        res.end(fs.lstatSync(reqPath).isFile() ? fs.readFileSync(reqPath) : fs.readFileSync('web/file_view.html'));
        return;
    } catch (e) {
        logger.error(e);
        res.status(404).end('404 Not Found')
        logger.error('404 GOD DAMMIT');
    }
    
})

module.exports = router
