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

		if (!userInfo) {
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
			"v1.MiniProgramUserTokenModel.findOne",
			[
				{
					userId: userInfo.id,
				},
			]
		);

		const accessToken = signJwt({ id: userInfo.id }, "30m");
		let createAccessToken = null;
		if (accessTokenInfo) {
			console.log("có lưu token rồi");
			createAccessToken = await this.broker.call(
				"v1.MiniProgramUserTokenModel.findOneAndUpdate",
				[
					{
						userId: userInfo.id,
					},
					{
						status: miniProgramUserTokenConstant.STATUS.ACTIVE,
						expiredTime: Moment(new Date()).add(30, "minutes"),
					},
				]
			);
		} else {
			console.log("chưa lưu token");
			createAccessToken = await this.broker.call(
				"v1.MiniProgramUserTokenModel.create",
				[
					{
						userId: userInfo.id,
						status: miniProgramUserTokenConstant.STATUS.ACTIVE,
						expiredTime: Moment(new Date()).add(30, "minutes"),
					},
				]
			);
		}

		if (_.get(createAccessToken, "id", null) === null) {
			return {
				code: 1001,
				message: "Thất bại",
			};
		}

		// await this.broker.call("v1.MiniProgramUserModel.findOneAndUpdate", [
		// 	{
		// 		email: obj.email,
		// 	},
		// 	{
		// 		accessToken,
		// 	},
		// ]);

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
