const { V3 } = require('paseto');
const crypto = require('crypto');

const secretKey = crypto.createSecretKey(Buffer.from(process.env.PASETO_SECRET_KEY, 'hex'));

const generateToken = async (payload) => {
    return await V3.encrypt(payload, secretKey, { expiresIn: '24h' });
};

const verifyToken = async (token) => {
    return await V3.decrypt(token, secretKey);
};

module.exports = { generateToken, verifyToken };