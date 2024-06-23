const JWT = require('jsonwebtoken');
const User = require('../models/User');

const checkAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies['jwt'];
        if (!cookie) {
            return res.status(401).send({ success: false, message: 'Unauthenticated' });
        }

        const claims = JWT.verify(cookie, process.env.JWT_SECRET);
        if (!claims) {
            return res.status(401).send({ success: false, message: 'Unauthenticated' });
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error('Error in isAuthenticated:', error.message);
        if (!res.headersSent) {
            res.status(500).send({ message: 'Internal server error' });
        }
    }
};

module.exports = checkAuth