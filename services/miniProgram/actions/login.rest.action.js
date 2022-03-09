const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const signJwt = require("../../helpers/signJwt.helper");
const Moment = require("moment");
const miniProgramUserTokenConstant = require("../constants/MiniProgramUserTokenConstant");

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const obj = {
			email: payload.email,
			password: payload.password,
		};

		//this.checkPhone();
		// const Client = this.broker.cacher.client;
		// Client.set("hellocl", "ASDF");

		let userInfo = await this.broker.call(
			"v1.MiniProgramUserModel.findOne",
			[
				{
					email: obj.email,
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
			obj.password,
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
					//loginTime: Moment(new Date()),
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
			{ userId: userInfo.id, tokenId: accessTokenInfo.id },
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
