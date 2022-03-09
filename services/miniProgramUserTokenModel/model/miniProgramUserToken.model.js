const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Moment = require("moment");
const miniProgramUserTokenConstant = require("../constants/MiniProgramUserTokenConstant");

autoIncrement.initialize(mongoose);

const Schema = mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
			unique: true,
		},
		expiredTime: {
			type: Date,
			default: Moment(new Date()).add(30, "minutes"),
		},
		userId: {
			type: Number,
			require: true,
		},
		logoutTime: {
			// type: [Date],
			// default: [],
			type: Date,
			default: null,
		},
		// loginTime: {
		// 	type: Date,
		// 	required: true,
		// },
		platform: {
			type: String,
			default: null,
		},
		deviceId: {
			type: Number,
			default: null,
		},
		status: {
			type: String,
			require: true,
			enum: [
				miniProgramUserTokenConstant.STATUS.ACTIVE,
				miniProgramUserTokenConstant.STATUS.DEACTIVE,
			],
		},
	},
	{
		collection: "Service_MiniProgramUserToken",
		versionKey: false,
		timestamps: true,
	}
);

Schema.plugin(autoIncrement.plugin, {
	model: `${Schema.options.collection}-id`,
	field: "id",
	startAt: 1,
	incrementBy: 1,
});

//Schema.plugin(autoIncrement.plugin, Schema.options.collection);

module.exports = mongoose.model(Schema.options.collection, Schema);
