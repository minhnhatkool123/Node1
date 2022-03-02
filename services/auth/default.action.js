const _ = require("lodash");
const moment = require("moment");
const { MoleculerError } = require("moleculer").Errors;
const miniProgramUserTokenConstant = require("../miniProgram/constants/MiniProgramUserTokenConstant");

module.exports = async function (ctx) {
	// throw new MoleculerError('Thông tin xác thực không hợp lệ', 401, null, null);
	try {
		const authInfo = ctx.params;
		console.log("authInFo", authInfo);

		const accessToken = await this.broker.call(
			"v1.MiniProgramUserTokenModel.findOne",
			[{ userId: authInfo.id }]
		);

		if (_.get(accessToken, "id", null) === null) {
			throw new MoleculerError(
				"Thông tin xác thực không hợp lệ",
				401,
				null,
				null
			);
		}

		if (moment(accessToken.expiredAt).isBefore(new Date())) {
			throw new MoleculerError(
				"Phiên đăng nhập đã hết hạn!",
				401,
				null,
				null
			);
		}

		if (accessToken.status !== miniProgramUserTokenConstant.STATUS.ACTIVE) {
			throw new MoleculerError(
				"Bạn đã đăng xuất vui lòng đăng nhập lại!",
				401,
				null,
				null
			);
		}

		const { userId } = accessToken;
		const userInfo = await this.broker.call(
			"v1.MiniProgramUserModel.findOne",
			[{ id: userId }, "-password"]
		);
		if (_.get(userInfo, "id", false) === false) {
			throw new MoleculerError(
				"Tài khoản không tồn tại!",
				401,
				null,
				null
			);
		}

		// if (_.isEmpty(authInfo)) {
		// 	throw new MoleculerError(
		// 		"Thông tin xác thực không hợp lệ",
		// 		401,
		// 		null,
		// 		null
		// 	);
		// }
		// const userInfo = await this.broker.call(
		// 	"v1.MiniProgramUserModel.findOne",
		// 	[{ id: authInfo.id }]
		// );
		// if (moment(accessToken.expiredAt).isBefore(new Date())) {
		// 	console.log("Authen false 2 :", accessToken);
		// 	throw new MoleculerError(
		// 		"Phiên đăng nhập đã hết hạn!",
		// 		401,
		// 		null,
		// 		null
		// 	);
		// }
		// if (!userInfo.accessToken) {
		// 	throw new MoleculerError(
		// 		"Bạn đã đăng xuất vui lòng đăng nhập lại",
		// 		401,
		// 		null,
		// 		null
		// 	);
		// }
		// if (_.get(userInfo, "id", null) === null) {
		// 	throw new MoleculerError(
		// 		"Thông tin xác thực không hợp lệ",
		// 		401,
		// 		null,
		// 		null
		// 	);
		// }
		return userInfo;
	} catch (e) {
		throw new MoleculerError(e.message, 401, null, null);
	}
};
