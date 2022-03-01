const _ = require('lodash');

const { MoleculerError } = require('moleculer').Errors;

module.exports = async function (ctx) {
    try {
        const payload = ctx.params.body;
        const obj = {
            id: payload.id,
        };

        let userInfo;
        userInfo = await this.broker.call('v1.MiniProgramUserModel.findOneAndUpdate', [{
            id: obj.id
        }, {
            accessToken: ""
        }])

        return {
            code: 1000,
            message: 'Đăng xuất thành công',
        };
    } catch (err) {
        if (err.name === 'MoleculerError') throw err;
        throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
    }
};
