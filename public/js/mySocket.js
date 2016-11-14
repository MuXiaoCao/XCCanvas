/**
 * Created by 木小草 on 2016/11/9.
 */
var socket = io.connect();

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var myCanvas = new draw_graph('pencil',canvas,context);


var id = getUUID();
var socketId = 0;
var drawSocketId = -1;

socket.on('message',function(data) {
    
    if (data.mousedown) {
        myCanvas.mousedown(data.mousedown);
    } else if(data.mousemove) {
        myCanvas.mousemove(data.mousemove);
    } else if(data.mouseup) {
        myCanvas.mouseup(data.mouseup);
    } else if(data.mouseout) {
        myCanvas.mouseout(data.mouseout);
    }
    if (data.data) {
        document.getElementById('time').innerHTML = data.data;
    }
    if (data.lineColor) {
        console.log(data.lineColor);
        myCanvas.setLineColor(data.lineColor.color);
    }
    if (data.lineSize) {
        myCanvas.setLineSize(data.lineSize.size);
    }
    if (data.clearAll) {
        myCanvas.clearContext();
    }
    if (data.drawUser) {
        console.log(data.drawUser);
        drawSocketId = data.drawUser;
    }
});
// 发送聊天消息
function sendMyData() {
    var sendData = document.getElementById('sendData').value;
    socket.send({data: sendData});
}


/*==============================================================*/

var SendSocket = io.connect();

SendSocket.emit('login', {userId: id, userName: returnCitySN["cip"]});
SendSocket.on('login', function(message){
    //onlineUsers:onlineUsers, onlineCount:onlineCount, user:message
    console.log(message.user.userId + "," + message.user.userName + "加入");
    document.getElementById('time').innerHTML = "欢迎 " + message.user.userName + " 加入聊天室";
    document.getElementById('count').innerHTML = "当前在线人数为：" + message.onlineCount;
});
SendSocket.on('logout', function(message){
    console.log(message.user.userId + "," + message.user.userName + "退出");
    document.getElementById('time').innerHTML = message.user.userName + " 退出聊天室";
    document.getElementById('count').innerHTML = "当前在线人数为：" + message.onlineCount;
});

SendSocket.on('message',function (data) {

    if (data.socketId) {
        console.log(data.socketId);
        socketId = data.socketId;
    }else if (data.applyDraw) {// 其他人申请持有画笔
        console.log(data.applyDraw);
        if(confirm(data.applyDraw + "正在向您申请持有画笔，同意请点确定")) {
            agreeApply(data.applyDraw);
        }else {

        }
    }
});
var canvas_bak = document.getElementById("canvas");
$(canvas_bak).unbind();
$(canvas_bak).bind('mousedown',function (e) {
    if (drawSocketId == socketId) {
        SendSocket.send({'mousedown':{
            clientX:e.pageX ,
            clientY:e.pageY
        },'clientId':id});
    }
});
$(canvas_bak).bind('mousemove',function (e) {
    if (drawSocketId == socketId) {
        SendSocket.send({
            'mousemove': {
                clientX: e.pageX,
                clientY: e.pageY
            }, 'clientId': id
        });
    }
});
$(canvas_bak).bind('mouseup',function (e) {
    if (drawSocketId == socketId) {
        SendSocket.send({
            'mouseup': {
                clientX: e.pageX,
                clientY: e.pageY
            }, 'clientId': id
        });
    }
});

function setLineColor(color) {
    if (!color) {
        return;
    }
    myCanvas.lineColor = color;
    SendSocket.send({'lineColor':{
        color: color
    }, 'clientId': id});
}

function setLineSize(size) {
    if (!size) {
        return;
    }
    myCanvas.lineSize = size;
    SendSocket.send({'lineSize':{
        size: size
    }, 'clientId': id});
}

function clearCanvas() {
    myCanvas.clearContext();
    SendSocket.send({'clearAll': {
        noThing:''
    }});
}
// 申请持有画笔
function applyDraw() {
    SendSocket.send({'applyDraw': {
        clientId:id
    }});
}
// 同意申请画笔
function agreeApply(socketId){
    SendSocket.send({'clientSuccessApply':{
        socketId:socketId
    }});
}
// 退出登录
function exit() {
    socket.emit('logout', {userId: id, userName: returnCitySN["cip"]});
    SendSocket.emit('logout', {userId: id, userName: returnCitySN["cip"]});
    SendSocket.disconnect();
    socket.disconnect();
    document.getElementById('time').innerHTML = "您已退出聊天室";
    document.getElementById('count').innerHTML = "当前在线人数为：" + 0;
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