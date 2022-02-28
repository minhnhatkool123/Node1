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

        //console.log('vao', obj)

        let userInfo;
        userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{
            email: obj.email
        }])


        if (!userInfo) {
            return {
                code: 1001,
                message: 'Thất bại chưa đk tài khoản',
            };
        }


        const createOTP = Math.floor(Math.random() * 9000000) + 1000000;
        const accessTokenEmail = signJwt({ email: obj.email, otp: createOTP.toString() }, '500m')



        //const newPassword = Math.floor(Math.random() * 9000000) + 1000000;
        //console.log(newPassword)
        await emailHelper.sendEmail('nhatnpm@payme.vn', createOTP, 'Please enter OTP code')


        // await this.broker.call('v1.MiniProgramUserModel.findOneAndUpdate', [{
        //     email: obj.email
        // }, {
        //     password: newPassword
        // }])

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
