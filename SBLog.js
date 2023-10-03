
const fs = require('fs');

class Logger {
    constructor(level, logInFile) {
        //console.log(logInFile);
        switch (level) {
            case 'debug':
                this.level = -1;
                break;
            case 'info':
                this.level = 0;
                break;
            case 'warn':
                this.level = 1;
                break;
            case 'error':
                this.level = 2;
                break;
        };
        this.opt = {
            flag: 'a'
        };
        this.logInFile = logInFile;
	this.logPath = 'file/latest.log'
    }
    debug(str) {
        if (this.level > -1) {
            return;
        }
        console.debug(`\x1b[33m[${Date.parse(new Date())}][调试🪳] ${str}\x1b[39m`);
        if (this.logInFile) {
            fs.writeFileSync(this.logPath, `[${Date.parse(new Date())}][调试🪳] ${str}\n`, this.opt);
        }
    }
    info(str) {
        if (this.level > 0) {
            return;
        }
        console.log(`[${Date.parse(new Date())}][信息😆] ${str}`);
        if (this.logInFile) {
            fs.writeFileSync(this.logPath, `[${Date.parse(new Date())}][调试🪳] ${str}\n`, this.opt);
        }
    }
    warn(str) {
        if (this.level > 1) {
            return;
        }
        console.log(`\x1b[33m[${Date.parse(new Date())}][警告⚠️] ${str}\x1b[39m`);
        if (this.logInFile) {
            fs.writeFileSync(this.logPath, `[${Date.parse(new Date())}][调试🪳] ${str}\n`, this.opt);
        }
    }
    error(str) {
        /*
        if (this.level > 2) {
            return;
        }
        // 所以我为啥要为一个不可能实现的条件而操心呢？
        */
        console.error(`\x1b[31m[${Date.parse(new Date())}][错误💥] ${str}\x1b[39m`);
        if (this.logInFile) {
            fs.writeFileSync(this.logPath, `[${Date.parse(new Date())}][调试🪳] ${str}\n`, this.opt);
        }
    }
}
module.exports = Logger
