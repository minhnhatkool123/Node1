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
            password: payload.password,
        };

        //console.log('vao', obj)

        let userInfo;
        userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{
            email: obj.email
        }])

        console.log('vao login')

        if (!userInfo) {
            return {
                code: 1001,
                message: 'Thất bại chưa đk tài khoản',
            };
        }

        const isMatchPassword = await bcrypt.compare(obj.password, userInfo.password);
        if (!isMatchPassword) {
            return {
                code: 1001,
                message: 'Thất bại sai tài khoản hoặc mật khẩu',
            };
        }

        const accessToken = signJwt({ id: userInfo.id, email: userInfo.email, }, '100d')
        const newPassword = Math.floor(Math.random() * 9000000) + 1000000;
        console.log(ctx)

        return {
            code: 1000,
            message: 'Đăng nhập thành công',
            accessToken
        };
    } catch (err) {
        if (err.name === 'MoleculerError') throw err;
        throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
    }
};
