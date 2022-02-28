const _ = require('lodash');

const { MoleculerError } = require('moleculer').Errors;
const bcrypt = require('bcrypt');
const JsonWebToken = require('jsonwebtoken');
const MiniProgramUserConstant = require('../constants/MiniProgramUserConstant');

module.exports = async function (ctx) {
    try {
        const payload = ctx.params.body;
        const obj = {
            name: payload.fullName,
            phone: payload.phone,
            email: payload.email,
            password: payload.password,
            gender: payload.gender,
            avatar: payload.avatar,
        };

        //console.log('vao', obj)

        let userInfo;
        userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{
            email: obj.email
        }])

        if (userInfo) {
            return {
                code: 1001,
                message: 'Thất bại trùng email',
            };
        }

        userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{
            phone: obj.phone
        }])

        if (userInfo) {
            return {
                code: 1001,
                message: 'Thất bại trùng sđt',
            };
        }


        //console.log(obj.password)
        const hashPassword = await bcrypt.hash(obj.password, 10);
        obj.password = hashPassword
        let miniProgramCreate;
        miniProgramCreate = await this.broker.call('v1.MiniProgramUserModel.create', [obj]);

        if (_.get(miniProgramCreate, 'id', null) === null) {
            return {
                code: 1001,
                message: 'Thất bại',
            };
        }

        // const miniProgramTokenInfo = {
        //     id: miniProgramCreate.id,
        //     scope: miniProgramCreate.scope,
        //     miniProgramId: miniProgramCreate.miniProgramId,
        // };

        // const miniProgramToken = JsonWebToken.sign(miniProgramTokenInfo, process.env.MINIPROGRAM_JWT_SECRETKEY);
        // miniProgramCreate = await this.broker.call('v1.MiniProgramInfoModel.findOneAndUpdate', [
        //     {
        //         id: miniProgramCreate.id,
        //     },
        //     {
        //         miniProgramToken,
        //     }]);

        // if (_.get(miniProgramCreate, 'id', null) === null) {
        //     return {
        //         code: 1001,
        //         message: 'Thất bại',
        //     };
        // }

        return {
            code: 1000,
            message: 'Tạo tài khoản thành công',
        };
    } catch (err) {
        if (err.name === 'MoleculerError') throw err;
        throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
    }
};
