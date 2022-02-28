const JsonWebToken = require('jsonwebtoken');

module.exports = function (data) {

    let otp = null;
    jwt.verify(data, process.env.ACCESS_TOKEN_SECRET, (error, otpEmail) => {
        if (error) {
            console.log('Invalid token');
        }
        otp = otpEmail
    });
    return otp;
}