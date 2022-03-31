const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const signJwt = require("../../helpers/signJwt.helper");
const miniProgramUserTokenConstant = require("../constants/MiniProgramUserTokenConstant");
const Moment = require("moment");

module.exports = async function (ctx) {
	try {
		const { email, password } = ctx.params.input;

		let userInfo = await this.broker.call(
			"v1.MiniProgramUserModel.findOne",
			[
				{
					email,
				},
			]
		);

		if (_.get(userInfo, "id", null) === null) {
			return {
				code: 1001,
				message: "Thất bại chưa đăng ký tài khoản",
			};
		}

		const isMatchPassword = await bcrypt.compare(
			password,
			userInfo.password
		);
		if (!isMatchPassword) {
			return {
				code: 1001,
				message: "Thất bại sai tài khoản hoặc mật khẩu",
			};
		}

		let accessTokenInfo = await this.broker.call(
			"v1.MiniProgramUserTokenModel.create",
			[
				{
					userId: userInfo.id,
					status: miniProgramUserTokenConstant.STATUS.ACTIVE,
					expiredTime: Moment(new Date()).add(30, "minutes"),
				},
			]
		);

		if (_.get(accessTokenInfo, "id", null) === null) {
			return {
				code: 1001,
				message: "Thất bại",
			};
		}

		console.log("accessTokenInfo", accessTokenInfo.id);
		const accessToken = signJwt(
			{
				userId: userInfo.id,
				tokenId: accessTokenInfo.id,
			},
			userInfo.scope.includes("admin.view.stat")
				? process.env.SECRET_KEY_ADMIN
				: process.env.ACCESS_TOKEN_SECRET,
			"30m"
		);

		return {
			code: 1000,
			message: "Đăng nhập thành công",
			accessToken,
		};
	} catch (err) {
		if (err.name === "MoleculerError") throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
