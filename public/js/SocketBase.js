/**
 * Created by muxiaocao on 2016/11/14.
 */

var socket = io.connect();
var clientSocket = new ClientSocket(socket,returnCitySN["cip"]);;
var canvas = document.getElementById("xcCanvas");

socket.emit('login',clientSocket.getSendMessage(Message.MessageType.login.code,null,null));

socket.on('login',function (message) {
    console.log(message);
    clientSocket.reciveDate(message);
});
socket.on('logout',function (message) {
    clientSocket.reciveDate(message);
});
socket.on('message',function (message) {
    clientSocket.reciveDate(message);
});

// 发送聊天消息
function sendMyData() {
    var sendData = document.getElementById('sendData').value;

    clientSocket.sendData(Message.MessageType.chatData.code,sendData);
};
// 申请持有画笔
function applyDraw() {
    clientSocket.sendData(Message.MessageType.applyDraw.code,null);
};

function setLineColor(color) {
    if (!color) {
        return;
    }
    if(clientSocket.checkDrawUser()) {
        clientSocket.sendData(Message.MessageType.drawParam.code, {
            'lineColor': {
                color: color
            }
        });
    }
}

function setLineSize(size) {
    if (!size) {
        return;
    }
    if(clientSocket.checkDrawUser()) {
        clientSocket.sendData(Message.MessageType.drawParam.code, {
            'lineSize': {
                size: size
            }
        });
    }
}

function clearCanvas() {
    if(clientSocket.checkDrawUser()) {
        clientSocket.sendData(Message.MessageType.drawParam.code, {
            'clearAll': {}
        });
    }
}

function drawExport() {
    if(clientSocket.checkDrawUser()) {
        clientSocket.sendData(Message.MessageType.drawExport.code,{
            'export':{}
        });
    }
}

// 退出登录
function exit() {
    if(clientSocket.checkDrawUser()) {
        clientSocket.sendData(Message.MessageType.logout.code, {
            nothing: ''
        });
    }
}


$(canvas).unbind();
$(canvas).bind('mousedown',function (e) {
    if (clientSocket.user.checkDrawUser(clientSocket.drawUser.userId)) {
        clientSocket.sendData(Message.MessageType.drawData.code, {
            'mousedown': {
                clientX: e.pageX,
                clientY: e.pageY
            }
        });
    }
});
$(canvas).bind('mousemove',function (e) {
    if (clientSocket.user.checkDrawUser(clientSocket.drawUser.userId)) {
        clientSocket.sendData(Message.MessageType.drawData.code, {
            'mousemove': {
                clientX: e.pageX,
                clientY: e.pageY
            }
        });
    }
});
$(canvas).bind('mouseup',function (e) {
    if (clientSocket.user.checkDrawUser(clientSocket.drawUser.userId)) {
        clientSocket.sendData(Message.MessageType.drawData.code, {
            'mouseup': {
                clientX: e.pageX,
                clientY: e.pageY
            }
        });
    }
});

