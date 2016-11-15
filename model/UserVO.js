/**
 * 客户模型
 * Created by 木小草 on 2016/11/14.
 */
var message = require('./MessageVO');

function UserVO(user) {
    // 客户端生成uuid
    this.userId = user.userId;
    // 通信id
    this.socketId = user.socketId;
    // 用户名称
    this.userName = user.userName;
}
UserVO.parseUser = function (user,socket) {
    if (!user.hasOwnProperty('userId') || !user.hasOwnProperty('userName')) {
        return message.parseUser.error;
    }else {
        user.socketId = socket.id;
        return new UserVO(user);
    }
}
UserVO.check = function () {
    if (this.userId && this.socketId && this.userName) {
        return true;
    }
    return false;
}
UserVO.initUser = function () {
    return new UserVO({
        userId:'-1',
        userName:'-1',
        socketId:'-1'
    });
}
UserVO.prototype.checkUserId = function (user) {
    return this.userId == user.userId;
}
module.exports = UserVO;


