/**
 * Created by 木小草 on 2016/11/14.
 */

var UserManager = require('./UserManager');
var User = require('../../model/UserVO');
var Message = require('../../model/MessageVO');
function ServerSocket() {
    
}
ServerSocket.init = function (io) {

    io.sockets.on('connection',function(socket) {

        console.log('连接成功');
        // 反馈socketId
        socket.emit("message",{socketId:socket.id});

        //监听新用户加入
        socket.on('login', function(message){
            var user = User.parseUser(message,socket);
            if (user.code) {
                // 数据格式错误
                console.log(user.name);
            }else {
                if(UserManager.login(user)) {
                    //向所有客户端广播用户加入
                    io.emit('login', UserManager.getMessage());
                }
            }
        });

        //监听用户退出
        socket.on('logout', function(message){
            console.log(message);
            var user = User.parseUser(message,socket);
            if (user.code) {
                // 数据格式错误
                console.log(user.name);
            }else {
                if(UserManager.logout(user)) {
                    //向所有客户端广播用户退出
                    io.emit('logout', UserManager.getMessage());
                }
            }
        });
        /**
         * 此message分为四种
         * 1. 申请持笔
         * 2. 同意持笔申请
         * 3. 接收聊天消息
         * 4. 接收画图信息
         * message格式如下：
         * {
         *      code:信息编号，
         *      info:个人信息，
         *      data:具体数据
         * }
         */
        socket.on('message',function (message) {

            switch (message.code) {
                case Message.messageType.applyDraw.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        var result = UserManager.applyDraw(user);
                        if(result.success) {
                            // 申请成功
                        }else if(result.haved){
                            // 已经持有
                        }else if(result.fail) {
                            // 申请失败
                        }else if(result.apply) {
                            // 提交申请
                            io.sockets.sockets[UserManager.drawUser.socketId].send({'applyDraw':UserManager.applyUser.userId});
                        }
                    }
                    break;
                }
                case Message.messageType.clientAgreeApply.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        UserManager.clientAgreeApply(user);
                        socket.broadcast.send({drawUser: UserManager.drawUser.userId});
                    }
                    break;
                }
                case Message.messageType.chatData.code: {
                    socket.broadcast.send(message.data);
                    break;
                }
                case Message.messageType.drawData: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        if(UserManager.checkDrawUser(user)) {
                            // 发送画图数据
                            socket.broadcast.send(message.data);
                        }
                    }
                }
            }

        });

    });

};
module.exports = ServerSocket;