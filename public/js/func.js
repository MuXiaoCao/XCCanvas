/**
 * Created by Administrator on 2016/11/4.
 */
var Func = function () {
    this.add = 1;
    this.ss = 'abc';
}

Func.bad = function () {
    console.log(this);
  alert(this.ss);
    alert(this.add);
};

new Func();
Func.bad();
