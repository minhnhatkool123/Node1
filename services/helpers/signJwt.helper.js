const JsonWebToken = require('jsonwebtoken');

module.exports = function (data, expiresIn) {
    // /console.log(process.env.ACCESS_TOKEN_SECRET)
    const accessToken = JsonWebToken.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn,
    });
    return accessToken;
}