const _ = require('lodash');
const moment = require('moment');
const { MoleculerError } = require('moleculer').Errors;

module.exports = async function (ctx) {
    // throw new MoleculerError('Thông tin xác thực không hợp lệ', 401, null, null);
    try {
        const authInfo = ctx.params;
        console.log('authInFo', authInfo)
        if (_.isEmpty(authInfo)) {
            throw new MoleculerError('Thông tin xác thực không hợp lệ', 401, null, null);
        }

        const userInfo = await this.broker.call('v1.MiniProgramUserModel.findOne', [{ id: authInfo.id }]);

        if (!userInfo.accessToken) {
            throw new MoleculerError('Bạn đã đăng xuất vui lòng đăng nhập lại', 401, null, null);
        }

        if (_.get(userInfo, 'id', null) === null) {
            throw new MoleculerError('Thông tin xác thực không hợp lệ', 401, null, null);
        }

        return userInfo;

    } catch (e) {
        throw new MoleculerError(e.message, 401, null, null);
    }
};
