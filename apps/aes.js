const crypto = require('crypto');

function AES(){
    this.Encrypt = (data, key) => {
        let cipher = crypto.createCipher('aes192', key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted = crypted + cipher.final('hex');
        return crypted;
    }

    this.Decrypt = (encrypt, key) => {
        let decipher = crypto.createDecipher('aes192', key);
        let decrypted = decipher.update(encrypt, 'hex', 'utf8');
        decrypted = decrypted + decipher.final('utf8');
        return decrypted;
    }
}

const aes = new AES();
const key = Buffer.from('WACooperationTask');

module.exports = {aes,key};