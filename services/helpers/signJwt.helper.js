const JsonWebToken = require("jsonwebtoken");

module.exports = function (payload, key, expiresIn) {
	const accessToken = JsonWebToken.sign(payload, key, {
		expiresIn: expiresIn,
	});
	return accessToken;
};
