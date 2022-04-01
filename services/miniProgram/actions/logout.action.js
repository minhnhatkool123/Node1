const _ = require("lodash");
const Moment = require("moment");
const { MoleculerError } = require("moleculer").Errors;
const miniProgramUserTokenConstant = require("../constants/MiniProgramUserTokenConstant");

module.exports = async function (ctx) {
	try {
		if (_.get(ctx, "meta.auth.credentials.userId", null) === null) {
			return {
				code: 1001,
				message: "Không tồn tại userId",
			};
		}

		if (_.get(ctx, "meta.auth.credentials.tokenId", null) === null) {
			return {
				code: 1001,
				message: "Không tồn tại tokenId",
			};
		}

		const payload = ctx.service.name.includes(".graph")
			? ctx.params.input
			: ctx.params.body;
		const obj = {
			id: payload.id,
		};

		if (parseInt(obj.id) !== ctx.meta.auth.credentials.userId) {
			return {
				code: 1001,
				message: "Thông tin không hợp lệ",
			};
		}

		console.log(ctx.meta.auth.credentials.userId);
		let accessTokenInfo = await this.broker.call(
			"v1.MiniProgramUserTokenModel.findOneAndUpdate",
			[
				{
					userId: ctx.meta.auth.credentials.userId,
					id: ctx.meta.auth.credentials.tokenId,
				},
				{
					status: miniProgramUserTokenConstant.STATUS.DEACTIVE,
					logoutTime: Moment(new Date()),
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
