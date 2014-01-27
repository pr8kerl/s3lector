var crypto = require('crypto');


function mkSalt() {
       return crypto.randomBytes(16).toString('base64');
}


function encryptPasswd(salt,password) {
        if (!password || !salt) return '';
        salt = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

var admin_password = 'willkommen';
var admin_salt = mkSalt();
var encrypted_password = encryptPasswd(admin_salt,admin_password);

console.log("salt: %s",admin_salt);
console.log("hashed_password: %s",encrypted_password);

