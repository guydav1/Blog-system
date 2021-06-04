const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');

async function auth(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jsonwebtoken.verify(token, process.env.JWT_STRING)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            console.log("NO USER");
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next()

    } catch (e) {
        return res.sendStatus(401) // token not authorized
    }
}

function admin(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.sendStatus(403);
    }
}

module.exports = { auth, admin };
// request -> auth -> admin -> route


