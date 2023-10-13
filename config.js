const fs = require('fs');
const YAML = require('yaml');

const defaultConfig = {
    server: {
        httpPort: 80,
        httpsPort: 443,
        host: '0.0.0.0',
        jwtKey: '',
        jwtKeyTimeout: '240h',
        cert: { private: '', public: '' },
        mail: { smtpUser: {'user': ''}, smtpServer: [Object] }
    },
    option: { showIP: true },
    database: {
        sqlite: {
            userDatabase: 'data/users.db',
            registerDatabase: 'data/register.db'
        }
    }
};

if (!fs.existsSync('config.yml')) {
    fs.writeFileSync('config.yml', YAML.stringify(defaultConfig));
}

const config  = YAML.parse(fs.readFileSync('config.yml').toString());

module.exports = config;