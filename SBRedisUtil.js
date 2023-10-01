const redis = require('redis');
const crypto = require('crypto');

crypto.randomUUID():
const client = redis.createClient();

client.connect();
function addUser(username, password) {
    client.hSet('users', {
        username: username,
        hashedPassword: crypto.createHash('sha1').update(passwords).digest('base64').toUpperCase(),
        UUID: crypto.randomUUID()
    });
}
addUser('xiaym', '114514');
client.disconnect();

