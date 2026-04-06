const { verifyToken } = require('../utils/paseto');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const payload = await verifyToken(token);
        req.user = await User.findById(payload.userId).select('_id role email');
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth;