const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const miniProgramUserConstant = require('../constants/MiniProgramUserConstant');

autoIncrement.initialize(mongoose)

const Schema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: [miniProgramUserConstant.GENDER.MALE, miniProgramUserConstant.GENDER.FEMALE]
    },
    avatar: {
        type: String,
        require: true,
    },
    accessToken: {
        type: String,
        default: ''
    }

}, {
    collection: 'Service_MiniProgramUser',
    versionKey: false,
    timestamps: true,
})


Schema.plugin(autoIncrement.plugin, {
    model: `${Schema.options.collection}-id`,
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

//Schema.plugin(autoIncrement.plugin, Schema.options.collection);

module.exports = mongoose.model(Schema.options.collection, Schema);
