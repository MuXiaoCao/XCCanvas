/**
 * Created by muxiaocao on 2016/11/14.
 */

var SocketClient = function (canvas,context) {
    // socket通信
    var socket = io.connect();
    // 画板
    var canvas = canvas;
    // 画布
    var context = context;
    // 画板基础类
    var myCanvas = new draw_graph('pencil',canvas,context);
    // tokenID，用户唯一标识
    var id = getUUID();
    // socketId,客户端与服务端对应识别id
    var socketId = 0;
    // 当前持有画笔的用户的id
    var drawSocketId = -1;
}

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