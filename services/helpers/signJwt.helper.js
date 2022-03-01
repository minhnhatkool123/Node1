const JsonWebToken = require('jsonwebtoken');

module.exports = function (payload, expiresIn) {
    const accessToken = JsonWebToken.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn,
    });
    return accessToken;
}