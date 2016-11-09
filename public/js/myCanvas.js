
//画图形
var draw_graph = function(graphType,canvas,context){

    this.graphType = graphType;

    //画布
    this.canvas = canvas;
    this.context = context;

    this.canvasLeft = canvas.offsetLeft;
    this.canvasTop = canvas.offsetTop;

    this.canDraw = false;// 按下标记
    // 画笔颜色
    this.lineColor = "red";
    // 画笔大小
    this.lineSize = 2;
}


//鼠标按下获取 开始xy开始画图
draw_graph.prototype.mousedown = function(e){
    e=e||window.event;
    this.context.strokeStyle = this.lineColor;
    this.context.lineWidth = this.lineSize;
    this.canDraw = true;
    if(this.graphType == 'pencil') {
        this.context.beginPath();
        console.log('down:' + e.clientX + "," + e.clientY);
    }
};
//鼠标离开 把蒙版canvas的图片生成到canvas中
draw_graph.prototype.mouseup = function(e){
    e=e||window.event;
    this.canDraw = false;
    console.log('up:' + e);
};

// 鼠标移动
draw_graph.prototype.mousemove = function(e){
    e=e||window.event;
    if(this.graphType == 'pencil'){
        if (this.canDraw) {
            var x = e.clientX - this.canvasLeft + 10;
            var y = e.clientY - this.canvasTop + 10;
            this.context.lineTo(x, y);
            console.log("x:" + e.clientX + ", y:" + e.clientY + "; newx:" + x + ", newy:" + y);
            this.context.stroke();
        }
    }
};


//鼠标离开区域以外 除了涂鸦 都清空
draw_graph.prototype.mouseout = function(e){
    if(this.graphType != 'handwriting'){
        this.clearContext();
        console.log('out:' + e);
    }
}


//清空层
draw_graph.prototype.clearContext = function() {
    this.context.clearRect(0, 0,this.canvas.width,this.canvas.height);
}

//设置画笔颜色
draw_graph.prototype.setLineColor = function (color) {
    this.lineColor = color;
}

// 设置画板粗细
draw_graph.prototype.setLineSize = function (size) {
    this.lineSize = size;
}

draw_graph.prototype.copyimage = function () {
    var img_png_src = canvas.toDataURL("image/png");  //将画板保存为图片格式的函数
    document.getElementById("image_png").src = img_png_src;
}