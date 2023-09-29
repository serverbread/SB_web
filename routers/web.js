'use strict';

const router = require('express').Router();
const fs = require('fs');
const SBLog = require('../SBLog.js')

const logger = new SBLog('error')
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