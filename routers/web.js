'use strict';

const router = require('express').Router();
const fs = require('fs');
const log4js = require('log4js')

const logger = log4js.getLogger();
logger.level = 'debug';
/*
router.use((req, res, next) => {
    
    next();
});
*/
router.get('/robots.txt', (req, res) => {
    res.end(fs.readFileSync('file/robots.txt'));
    return;
})

router.get('/favicon.ico', (req, res) => {
    res.end(fs.readFileSync('file/img/favicon.ico'));
    return;
})

router.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('web/index.html'));
    return;
})
router.get('/p*', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('web/passage_view.html'));
    return;
})
module.exports = router
