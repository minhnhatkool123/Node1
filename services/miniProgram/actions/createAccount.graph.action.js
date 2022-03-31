const _ = require("lodash");

const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.input;
		const obj = {
			name: payload.name,
			phone: payload.phone,
			email: payload.email,
			password: payload.password,
			gender: payload.gender,
			avatar: payload.avatar,
		};

		if (!_.isNil(_.get(payload, "isAdmin", null))) {
			if (payload.isAdmin) {
				obj.scope = ["admin.view.stat"];
			}
		}

		let userInfo = await this.broker.call(
			"v1.MiniProgramUserModel.findOne",
			[{ $or: [{ email: obj.email }, { phone: obj.phone }] }]
		);

		console.log(userInfo);
		if (_.get(userInfo, "email", null) === obj.email) {
			return {
				code: 1001,
				message: "Thất bại trùng email",
			};
		}

		if (_.get(userInfo, "phone", null) === obj.phone) {
			return {
				code: 1001,
				message: "Thất bại trung sđt",
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
