/*
 * Create an admin user with default password.
 * simply run 'mongo <mongo database name> ./mkAdmin.js'
 *
 */

function mkSalt() {
       return crypto.randomBytes(16).toString('base64');
}


function encryptPasswd(salt,password) {
        if (!password || !salt) return '';
        salt = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

var admin_password = 'willkommen';
var admin_salt = '8v1VM09/4kHcciKLaB6W+w==';
var encrypted_password = '4sezIl35bigZf1KsJg3p++HWFCI6ctl+Q2Gu3elnjXQrlJao/PHSaDzI89B3Ru+YFgMXdB+5boM7TlYMrUkJGg==';

var admin_user = {
    name: 'admin',
    email: 'admin@localhost',
    username: 'local admin',
    admin: true,
    hashed_password: encrypted_password,
    provider: 'local',
    salt: admin_salt
};

db.users.insert(admin_user);

