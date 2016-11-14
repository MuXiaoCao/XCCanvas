/**
 * Created by muxiaocao on 2016/11/14.
 */
var User = function (socketId,userName,userId) {
    if(this.prototype.number) {
        this.prototype.number++;
    }else {
        this.prototype.number = 0;
    }
    this.socketId = socketId | -1;
    this.userId = userId | getUUID();
    this.userName = userName | '观众' + this.prototype.number;
};
User.prototype.checkDrawUser = function (userId) {
    return userId == this.userId;
};
var ClientSocket = function (socket,userName) {
    this.socket = socket | io.connect();
    this.user = new User(socket.id,userName);
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    this.myCanvas = new draw_graph('pencil',canvas,context);
    this.drawUser = new User(null,null,-1);
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
ClientSocket.sendData = function (messageType,data) {
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
        case Message.MessageType.drawData: {
            // 发送画图信息
            if (this.user.checkDrawUser(this.drawUser.userId)) {
                break;
            }
            this.socket.send(Message.getSendMessage(messageType,this.user,data));
            break;
        }
        case Message.MessageType.login: {
            this.user.userName = data.name;
            this.socket.send(Message.getSendMessage(messageType,this.user,null));
            break;
        }
    }
};

/*=====================接收数据====================*/
/**
 * 接收画图数据
 * @param drawData
 *      {
 *
 *      }
 */
ClientSocket.reciveDate = function (message) {
    switch (message.code) {
        case Message.MessageType.applyDraw.code: {
            // 有人申请持笔

            break;
        }
        case Message.MessageType.chatData.code: {
            // 聊天数据
            break;
        }
        case Message.MessageType.drawData: {
            // 画板数据
            break;
        }
    }
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
    }
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