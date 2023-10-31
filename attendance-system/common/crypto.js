const crypto = require('crypto');
const { CRYPTO : { ENCRYPTION_TYPE } } = require('../environment');
// const key = crypto.randomBytes(16);     defaultValue: "aes-128-cbc",
const iv = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync('prancypoodle', 'sherylcrowe', 10000, 16, 'sha512');
let encrypt = (jwtToken) => {
    let cipher = crypto.createCipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let encrypted = cipher.update(jwtToken);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
let decrypt = (encryptedToken) => {
    // let iv = Buffer.from(encryptedToken.iv, 'hex');
    // let encryptedText = Buffer.from(encryptedToken.encryptedData, 'hex');
    let textParts = encryptedToken.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encrypt, decrypt
}