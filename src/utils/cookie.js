export function getCookie(name) { //获取指定名称的cookie值
    // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        //console.log(arr);
        return unescape(arr[2]);
    }
    return null;
}

export function delCookie(name) {   //删除 cookie 直接把 expires 参数设置为过去的日期即可：

    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null){
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
       
}

export function getStorage(name){
    var dataSession=localStorage.getItem(name);//获取指定键名数据
    if (dataSession != null) {
        return dataSession;
    }
    return null;
}