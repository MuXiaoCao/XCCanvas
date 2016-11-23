/**
 * Created by 木小草 on 2016/11/14.
 */

var UserManager = require('./UserManager');
var User = require('../../model/UserVO');
var Message = require('../../model/MessageVO');
function ServerSocket() {
    
}

ServerSocket.init = function (io,session) {

    io.sockets.on('connection',function(socket) {

        console.log('连接成功');


        //监听新用户加入
        socket.on('login', function(message){
            console.log("receive login：");
            console.log(message);
            var user = User.parseUser(message.info,socket);
            if (user.code) {
                // 数据格式错误
                console.log(user.name);
            }else {
                if(UserManager.login(user)) {
                    user.socketId = socket.id;
                    // 反馈socketId
                    console.log(user.userName);
                    socket.emit("message",UserManager.getMessage(Message.messageType.login.code,user.userName,null));
                    //向所有客户端广播用户加入
                    io.emit('login', UserManager.getMessage(Message.messageType.login.code,user.userName,null));
                }
            }
        });

        //监听用户退出
        socket.on('logout', function(message){
            console.log(message);
            var user = User.parseUser(message.info,socket);
            if (user.code) {
                // 数据格式错误
                console.log(user.name);
            }else {
                if(UserManager.logout(user)) {
                    //向所有客户端广播用户退出
                    io.emit('logout', UserManager.getMessage(Message.messageType.logout.code,user.userName,null));
                }
            }
        });
        /**
         * 此message分为四种
         * 1. 申请持笔
         * 2. 同意持笔申请
         * 3. 接收聊天消息
         * 4. 接收画图信息
         * 5. 接收画笔参数信息
         * message格式如下：
         * {
         *      code:信息编号，
         *      info:个人信息，
         *      data:具体数据
         * }
         */
        socket.on('message',function (message) {
            console.log('receive message:');
            console.log(message);
            switch (message.code) {
                // 申请持笔
                case Message.messageType.applyDraw.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        var result = UserManager.applyDraw(user);
                        if(result.success) {
                            console.log(user.userId + "申请成功");
                            // 申请成功
                            socket.emit('message',
                                UserManager.getMessage(Message.messageType.clientAgreeApply.code,user.userName,null)
                            );
                        }else if(result.haved){
                            // 已经持有
                        }else if(result.fail) {
                            // 申请失败
                        }else if(result.apply) {
                            // 提交申请
                            io.sockets.sockets[UserManager.drawUser.socketId].send(
                                UserManager.getMessage(Message.messageType.applyDraw.code,user.userName,null)
                            );
                        }
                    }
                    break;
                }
                // 用户同意持笔申请
                case Message.messageType.clientAgreeApply.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        UserManager.clientAgreeApply(user);
                        io.sockets.sockets[UserManager.drawUser.socketId].send(
                            UserManager.getMessage(Message.messageType.clientAgreeApply.code,user.userName,null)
                        );
                    }
                    break;
                }
                // 聊天信息
                case Message.messageType.chatData.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        console.log('chat ' + user.userId);
                        io.emit('message',
                            UserManager.getMessage(Message.messageType.chatData.code,UserManager.getUserByUserId(user.userId),message.data)
                        );
                    }
                    break;
                }
                // 画笔信息
                case Message.messageType.drawData.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        if(UserManager.checkDrawUser(user)) {
                            // 发送画图数据
                            io.emit('message',
                                UserManager.getMessage(Message.messageType.drawData.code,user.userName,message.data)
                            );
                        }
                    }
                    break;
                }
                case Message.messageType.drawParam.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        if (UserManager.checkDrawUser(user)) {
                            // 发送画笔参数信息
                            io.emit('message',
                                UserManager.getMessage(Message.messageType.drawParam.code,user.userName,message.data)
                            );
                        }
                    }
                    break;
                }
                case Message.messageType.drawExport.code: {
                    var user = User.parseUser(message.info,socket);
                    if (user.code) {
                        // 数据格式错误
                        console.log(user.name);
                    }else {
                        if (UserManager.checkDrawUser(user)) {
                            io.emit('message',
                                UserManager.getMessage(Message.messageType.drawExport.code,user.userName,message.data)
                            );
                        }
                    }
                    break;
                }
            }

        });
    });
};
module.exports = ServerSocket;