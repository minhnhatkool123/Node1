const _ = require("lodash");

const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const JsonWebToken = require("jsonwebtoken");
const MiniProgramUserConstant = require("../constants/MiniProgramUserConstant");

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const obj = {
			name: payload.fullName,
			phone: payload.phone,
			email: payload.email,
			password: payload.password,
			gender: payload.gender,
			avatar: payload.avatar,
		};

		let userInfo = await this.broker.call(
			"v1.MiniProgramUserModel.findOne",
			[
				{ $or: [{ email: obj.email }, { phone: obj.phone }] },
				"-_id phone email",
			]
		);

		console.log(userInfo);
		if (userInfo?.email === obj.email) {
			return {
				code: 1001,
				message: "Thất bại trùng email",
			};
		}

		if (userInfo?.phone === obj.phone) {
			return {
				code: 1001,
				message: "Thất bại trùng sđt",
			};
		}

		const hashPassword = await bcrypt.hash(obj.password, 10);
		obj.password = hashPassword;
		let miniProgramCreate = await this.broker.call(
			"v1.MiniProgramUserModel.create",
			[obj]
		);

		if (_.get(miniProgramCreate, "id", null) === null) {
			return {
				code: 1001,
				message: "Thất bại",
			};
		}

		return {
			code: 1000,
			message: "Tạo tài khoản thành công",
		};
	} catch (err) {
		if (err.name === "MoleculerError") throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
