const _ = require("lodash");
const Moment = require("moment");
const { MoleculerError } = require("moleculer").Errors;
const miniProgramUserTokenConstant = require("../constants/MiniProgramUserTokenConstant");

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const obj = {
			id: payload.id,
		};

		console.log(obj.id);
		let accessTokenInfo = await this.broker.call(
			"v1.MiniProgramUserTokenModel.findOneAndUpdate",
			[
				{
					userId: obj.id,
				},
				{
					status: miniProgramUserTokenConstant.STATUS.DEACTIVE,
					$push: {
						logoutTime: Moment(new Date()),
					},
					//logoutTime: Moment(new Date()),
				},
			]
		);

		if (_.get(accessTokenInfo, "id", null) === null) {
			return {
				code: 1001,
				message: "Thất bại",
			};
		}

		return {
			code: 1000,
			message: "Đăng xuất thành công",
		};
	} catch (err) {
		if (err.name === "MoleculerError") throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
