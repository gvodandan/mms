import request from "../utils/request"

export default {

    //校验密码，userId是用户ID，password是旧密码
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: "post",
            data: {
                userId,
                password
            }
        })
    },

    //修改密码,userId是用户ID，password是新密码
    update(userId, password) {
        return request({
            url: '/user/pwd',
            method: "put",
            data: {
                userId,
                password
            }
        })
    }
}