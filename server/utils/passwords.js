const crypto = require('crypto');

const KEY_LENGTH = 64;

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    if (!storedHash || !storedHash.includes(':')) {
      resolve(false);
      return;
    }

    const [salt, key] = storedHash.split(':');
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      const storedKey = Buffer.from(key, 'hex');
      if (storedKey.length !== derivedKey.length) {
        resolve(false);
        return;
      }

      resolve(crypto.timingSafeEqual(storedKey, derivedKey));
    });
  });
}

function generateResetToken() {
  return crypto.randomBytes(24).toString('base64url');
}

module.exports = { hashPassword, verifyPassword, generateResetToken };
