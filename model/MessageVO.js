/**
 * Created by muxiaocao on 2016/11/14.
 */

function MessageVO() {

}
MessageVO.applyDrawResult = {
    success:{
        success:'success',
        code:1,
        name:'申请成功'
    },
    haved: {
        haved:'haved',
        code:2,
        name:'已经持有'
    },
    fail: {
        fail:'fail',
        code:-1,
        name:'申请失败'
    },
    apply: {
        apply:'apply',
        code:0,
        name:'提交申请'
    }
};

MessageVO.parseUser = {
    error: {
        code:0,
        name:'数据格式错误'
    }
}

MessageVO.getMessage = function (messageTypeCode,onlineCount,drawId,userName,data) {
    return {
        code:messageTypeCode,
        onlineCount:onlineCount,
        drawId:drawId,
        userName:userName,
        data:data
    }
}
/**
 * 此message分为四种
 * 1. 申请持笔
 * 2. 同意持笔申请
 * 3. 发送聊天消息
 * 4. 发送画图信息
 * 0. 登录
 * -1.退出
 */
MessageVO.messageType = {
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
}
module.exports = MessageVO;