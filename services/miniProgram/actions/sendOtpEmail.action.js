const _ = require("lodash");
const Moment = require("moment");
const { MoleculerError } = require("moleculer").Errors;
const emailHelper = require("../../helpers/email.helper");

module.exports = async function (ctx) {
	try {
		const payload = ctx.service.name.includes(".graph")
			? ctx.params.input
			: ctx.params.body;
		const obj = {
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

		if (!userInfo) {
			return {
				code: 1001,
				message: "Thất bại chưa đăng ký tài khoản",
			};
		}

		let randomOTP = Math.floor(Math.random() * 9000000) + 1000000;
		const createOTP = await this.broker.call(
			"v1.MiniProgramOtpModel.create",
			[
				{
					email: userInfo.email,
					code: randomOTP.toString(),
					expiredTime: Moment(new Date()).add(15, "minutes"),
				},
			]
		);

		if (_.get(createOTP, "id", null) === null) {
			return {
				code: 1001,
				message: "Tạo otp thất bại",
			};
		}

		await emailHelper.sendEmail(
			obj.email,
			randomOTP,
			"Please enter OTP code"
		),
			console.log("created OTP", createOTP);

		return {
			code: 1000,
			message: "Gửi email thành công vui lòng kiểm tra email",
		};
	} catch (err) {
		if (err.name === "MoleculerError") throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
