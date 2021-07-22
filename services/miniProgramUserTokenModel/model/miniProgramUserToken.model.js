const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { customAlphabet } = require('nanoid');
const { alphanumeric } = require('nanoid-dictionary');
const _ = require('lodash');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');

const nanoId = customAlphabet(alphanumeric, 15);

autoIncrement.initialize(mongoose);

const Schema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	miniProgramId: {
		type: Number,
		require: true,
		unique: true,
	},
	accountId: {
		type: Number,
		require: true,
	},
	expiredAt: {
		type: Date,
		require: true,
	},
	platform: {
		type: String,
		default: null,
	},
	scope: [
		{
			type: String,
			enum: _.values(MiniProgramUserTokenConstant.SCOPE),
		},
	],
	state: {
		type: String,
		require: true,
		enum: _.values(MiniProgramUserTokenConstant.STATE),
	},
}, {
	collection: 'Service_MiniProgramUserToken',
	versionKey: false,
	timestamps: true,
});

/*
| ==========================================================
| Plugins
| ==========================================================
*/

Schema.plugin(autoIncrement.plugin, {
	model: `${Schema.options.collection}-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

/*
| ==========================================================
| Methods
| ==========================================================
*/

/*
| ==========================================================
| HOOKS
| ==========================================================
*/

module.exports = mongoose.model(Schema.options.collection, Schema);