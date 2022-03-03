const _ = require("lodash");
const Moment = require("moment");
const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const emailHelper = require("../../helpers/email.helper");

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const obj = {
			otp: payload.otp,
			email: payload.email,
		};

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

		let otpInfo = await this.broker.call("v1.MiniProgramOtpModel.findOne", [
			{
				email: userInfo.email,
			},
		]);

		if (_.get(otpInfo, "id", null) === null) {
			return {
				code: 1001,
				message: "Reset mật khẩu thất bại",
			};
		}

		if (otpInfo.code !== obj.otp) {
			return {
				code: 1001,
				message: "Sai mã otp",
			};
		}

		if (Moment(otpInfo.expiredTime).isBefore(new Date())) {
			return {
				code: 1001,
				message: "Mã otp đã hết hạn",
			};
		}

		const newPassword = Math.floor(Math.random() * 9000000) + 1000000;
		const hashPassword = await bcrypt.hash(newPassword.toString(), 10);
		const [updateUser] = await Promise.all([
			this.broker.call("v1.MiniProgramUserModel.findOneAndUpdate", [
				{
					email: userInfo.email,
				},
				{
					password: hashPassword,
				},
			]),
			emailHelper.sendEmail(userInfo.email, newPassword, "New password"),
			this.broker.call("v1.MiniProgramOtpModel.deleteMany", [
				{
					email: userInfo.email,
				},
			]),
		]);

		console.log("updateUser", updateUser);
		if (_.get(updateUser, "id", null) === null) {
			return {
				code: 1001,
				message: "Đổi mật khẩu thất bại",
			};
		}

		return {
			code: 1000,
			message: "Mật khẩu đã đã được reset vui lòng kiểm tra email",
		};
	} catch (err) {
		if (err.name === "MoleculerError") throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
