/**
 * Created by muxiaocao on 2016/11/14.
 */
var User = function (socketId,userName) {

    this.socketId = socketId;
    this.userId = getUUID();

    this.userName = userName;
};
User.prototype.checkDrawUser = function (userId) {
    return userId == this.userId;
};
var ClientSocket = function (socket,userName) {
    this.socket = socket;
    this.user = new User(socket.id,userName);
    var canvas = document.getElementById("xcCanvas");
    var context = canvas.getContext("2d");
    this.myCanvas = new draw_graph('pencil',canvas,context);
    this.drawUser = new User(null,null,-1);

    this.chatArea = document.getElementById("xcChat");
    this.userCountArea = document.getElementById("xcCount");
};
/*========================发送数据=========================*/
/**
 * 发送数据
 * 分为四种：
 * 1. 申请持笔
 * 2. 同意持笔申请
 * 3. 发送聊天消息
 * 4. 发送画图信息
 * 通过message中的code区分
 */
ClientSocket.prototype.sendData = function (messageType,data) {
    switch (messageType) {
        case Message.MessageType.applyDraw.code: {
            if (this.user.checkDrawUser(this.drawUser.userId)) {
                break;
            }
            // 发送申请持笔信息
            this.socket.send(Message.getSendMessage(messageType,this.user,null));
            break;
        }
        case Message.MessageType.clientAgreeApply.code: {
            // 发送同意持笔申请消息
            this.socket.send(Message.getSendMessage(messageType,this.user,null));
            break;
        }
        case Message.MessageType.chatData.code: {
            // 发送聊天消息
            this.socket.send(Message.getSendMessage(messageType,this.user,data));
            break;
        }
        case Message.MessageType.drawData.code: {
            // 发送画图信息
            this.socket.send(Message.getSendMessage(messageType,this.user,data));
            break;
        }
        case Message.MessageType.login.code: {
            console.log('send login info' + Message.getSendMessage(messageType,this.user,null));
            this.socket.send(Message.getSendMessage(messageType,this.user,null));
            break;
        }
        case Message.MessageType.logout.code: {

            this.socket.emit('logout',Message.getSendMessage(messageType,this.user,data));
            this.socket.disconnect();
            this.chatArea.innerHTML = "您已退出聊天室";
            this.userCountArea.innerHTML = "当前在线人数为：" + 0;
            break;
        }
        case Message.MessageType.drawParam.code: {
            if (data.lineSize) {
                this.myCanvas.lineSize = data.lineSize.size;
            }else if(data.lineColor) {
                this.myCanvas.lineColor = data.lineColor.color;
            }else if(data.clearAll) {
                this.myCanvas.clearContext();
            }
            this.socket.send(Message.getSendMessage(messageType,this.user,data));
            break;
        }
        case Message.MessageType.drawExport.code: {
            this.socket.send(Message.getSendMessage(messageType,this.user,data));
            break;
        }
    }
};

/*=====================接收数据====================*/
/**
 * 接收画图数据
 * @param drawData
 *      {
 *          code:messageTypeCode,
            onlineCount:onlineCount,
            drawId:drawId,
            userName:userName,
            data:data
            
 *      }
 */
ClientSocket.prototype.reciveDate = function (message) {
    if(message.drawId) {
        this.drawUser.userId = message.drawId;
    }
    console.log(message.code);
    switch (message.code) {
        case Message.MessageType.applyDraw.code: {
            // 有人申请持笔
            console.log(message.userName);
            if(confirm(message.userName + "正在向您申请持有画笔，同意请点确定")) {
                this.socket.send(this.getSendMessage(Message.MessageType.clientAgreeApply.code,null));
                this.drawUser = new User(null,message.userName);
            }else {

            }
            break;
        }
        case Message.MessageType.clientAgreeApply.code: {
            // 申请成功
            alert('申请成功，您可以操作画笔了！');
            this.drawUser.userId = message.drawId;
            break;
        }
        case Message.MessageType.chatData.code: {
            // 聊天数据
            this.chatArea.innerHTML = message.data;
            break;
        }
        case Message.MessageType.drawData.code: {
            // 画板数据
            if (message.data.mousedown) {
                this.myCanvas.mousedown(message.data.mousedown);
            }else if(message.data.mousemove) {
                this.myCanvas.mousemove(message.data.mousemove);
            } else if(message.data.mouseup) {
                this.myCanvas.mouseup(message.data.mouseup);
            } else if(message.data.mouseout) {
                this.myCanvas.mouseout(message.data.mouseout);
            }
            break;
        }
        case Message.MessageType.login.code: {
            // 登录信息
            this.chatArea.innerHTML = Message.showUserLoginInfo(message.userName);
            this.userCountArea.innerHTML = Message.showUserCountInfo(message.onlineCount);
            break;
        }
        case Message.MessageType.logout.code: {
            // 退出信息
            this.chatArea.innerHTML = Message.showUserLogoutInfo(message.userName);
            this.userCountArea.innerHTML = Message.showUserCountInfo(message.onlineCount);

            break;
        }
        case Message.MessageType.drawParam.code: {
            console.log(message);
            if (message.data.lineSize) {
                this.myCanvas.lineSize = message.data.lineSize.size;
            }else if(message.data.lineColor) {
                this.myCanvas.lineColor = message.data.lineColor.color;
            }else if(message.data.clearAll) {
                this.myCanvas.clearContext();
            }
            break;
        }
        case Message.MessageType.drawExport.code: {
            this.myCanvas.copyimage();
            break;
        }
    }
};
ClientSocket.prototype.getSendMessage = function (code,data) {
    return Message.getSendMessage(code,this.user,data);
};
ClientSocket.prototype.checkDrawUser = function () {
    return this.user.checkDrawUser(this.drawUser.userId);
};

var Message = {};
Message.MessageType = {
    applyDraw:{
        code:1,
        name:'申请持笔',
        value:'applyDraw'
    },
    clientAgreeApply: {
        code:2,
        name:'同意持笔申请',
        value:'clientAgreeApply'
    },
    chatData: {
        code:3,
        name:'聊天数据',
        value:'chatData'
    },
    drawData: {
        code:4,
        name:'画图数据',
        value:'drawData'
    },
    login: {
        code:0,
        name:'登录',
        value:'login'
    },
    logout: {
        code:-1,
        name:'退出',
        value:'logout'
    },
    drawParam: {
        code:5,
        name:'画笔属性',
        value:'drawParam'
    },
    drawExport: {
        code:6,
        name:'画图导出',
        value:'drawExport'
    }
};

/**
 * message格式如下：
 * {
 *      code:信息编号，
 *      info:个人信息，
 *      data:具体数据
 * }
 */
Message.getSendMessage = function (code,user,data) {
    return {
        code:code,
        info:user,
        data:data
    };
};
Message.showUserLoginInfo = function (userName) {
    return "欢迎" + userName + "加入(" + getNowFormatDate() + ")";
};

Message.showUserLogoutInfo = function (userName) {
    return "本系统沉重的宣布，" + userName + "同志已在" + getNowFormatDate() + "永远的离开了我们~~~";
};
Message.showUserCountInfo = function (count) {
    return "当前在线人数为：" + count;
};

function getUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}