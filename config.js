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
        mail: { smtpUser: {user: 'shabi', pass: '000'}, smtpServer: {host: '127.0.0.1', port: 25, secure: false} }
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