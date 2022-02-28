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
            otp: payload.otp,
        };

        //console.log('vao', obj)


        // let userInfo;
        // userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{
        //     email: obj.email
        // }])

        // console.log(ctx.meta.auth.credentials.otp)
        // console.log(typeof obj.otp)
        if (ctx.meta.auth.credentials.otp !== obj.otp) {
            return {
                code: 1001,
                message: 'Mã otp sai',
            };
        }






        const newPassword = Math.floor(Math.random() * 9000000) + 1000000;
        //console.log(newPassword)
        await emailHelper.sendEmail('nhatnpm@payme.vn', newPassword, 'New password')
        const hashPassword = await bcrypt.hash(newPassword.toString(), 10);


        await this.broker.call('v1.MiniProgramUserModel.findOneAndUpdate', [{
            email: ctx.meta.auth.credentials.email
        }, {
            password: hashPassword
        }])

        return {
            code: 1000,
            message: 'Mật khẩu đã đã được reset vui lòng kiểm tra email',
        };
    } catch (err) {
        if (err.name === 'MoleculerError') throw err;
        throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
    }
};
