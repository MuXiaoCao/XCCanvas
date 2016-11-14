/**
 * Created by 木小草 on 2016/11/14.
 */

var Message = require('../../model/MessageVO');// 引入serviceResult用户封装信息，反馈给上一层
var User = require('../../model/UserVO');

var UserManager = function () {

    // 持有者
    this.drawUser = User.initUser();
    // 申请者
    this.applyUser = User.initUser();

    //在线用户
    this.onlineUsers = {};
    //在线用户数
    this.onlineCount = 0;

    this.setDrawUser = function (user) {
        this.drawUser = new User(user);
    };
    this.initDraw = function () {
        this.drawUser = User.initUser();
    };
    this.setApplyUser = function (user) {
        this.applyUser = new User(user);
    };
}

// 登录
UserManager.login = function (user) {
    //检查在线列表，如果不在里面就加入
    if (!this.onlineUsers.hasOwnProperty(user.userId)) {
        this.onlineUsers[user.userId] = user.userName;
        //在线人数+1
        this.onlineCount++;
        console.log(user.userName + '加入了聊天室');
        return true;
    }
    return false;
};

// 退出
UserManager.logout = function (user) {
    console.log(user);
    //将退出的用户从在线列表中删除
    if (this.onlineUsers.hasOwnProperty(user.userId)) {
        //退出用户的信息
        var obj = {userId: user.userId, userName: this.onlineUsers[user.userId]};

        //删除
        delete this.onlineUsers[user.userId];
        //在线人数-1
        this.onlineCount--;

        if (this.drawID != null && user.userId == this.drawID) {
            // 重置画板
            this.initDraw();
        }
        console.log(obj.userName + '退出了聊天室');
        return true;
    }
    return false;
};

// 申请画笔
UserManager.applyDraw = function (user) {
    // 如果当前没有人持有画笔
    if (!this.drawID && user.userId && user.socketId) {
        this.setDrawUser(user);
        return Message.applyDrawResult.success;
    } else {
        // 当前有持有用户，则需要询问持有用户是否同意
        if (this.drawUser.checkUserId(user)) {
            console.log(user.userId + "已经持有画笔");
            return Message.applyDrawResult.haved;
        } else {
            this.setApplyUser(user);
            return Message.applyDrawResult.apply;
        }
        return Message.applyDrawResult.fail;
    }
};

// 持笔者同意转让画笔
UserManager.clientAgreeApply = function () {
    this.drawUser = this.applyUser;
    this.applyUser = null;
};

// 检查是否是持笔者
UserManager.checkDrawUser = function (user) {
    return this.drawUser.checkUserId(user);
};

UserManager.getMessage = function () {
    return Message.getMessage(this.onlineCount,this.drawUser.userId);
};

module.exports = UserManager;

