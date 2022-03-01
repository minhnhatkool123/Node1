const _ = require('lodash');

const { MoleculerError } = require('moleculer').Errors;
const bcrypt = require('bcrypt');
const JsonWebToken = require('jsonwebtoken');
const MiniProgramUserConstant = require('../constants/MiniProgramUserConstant');
const signJwt = require('../../helpers/signJwt.helper')
const emailHelper = require('../../helpers/email.helper')

module.exports = async function (ctx) {
    try {
        const payload = ctx.params.body;
        const obj = {
            email: payload.email,
        };
        console.log('EMAIL', typeof obj.email)

        let userInfo;
        userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{
            email: obj.email
        }])

        if (!userInfo) {
            return {
                code: 1001,
                message: 'Thất bại chưa đăng ký tài khoản',
            };
        }

        const createOTP = Math.floor(Math.random() * 9000000) + 1000000;
        const accessTokenEmail = signJwt({ email: obj.email, otp: createOTP.toString() }, '60m')

        await emailHelper.sendEmail(/*'nhatnpm@payme.vn'*/obj.email, createOTP, 'Please enter OTP code')

        return {
            code: 1000,
            message: 'Gửi email thành công vui lòng kiểm tra email',
            accessTokenEmail
        };
    } catch (err) {
        if (err.name === 'MoleculerError') throw err;
        throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
    }
};
