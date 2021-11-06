const todayInfo=start=>{  //传进来时间返回到该天的天数 
  
    let remainInfo = null, // 初始化返回信息 默认null
        oneDay = 24 * 60 * 60 * 1000, // 一天的毫秒时长
        today, // 今天
        dateDiff, // 今天与考试当天日期差
        sDate; //考试之日，日期对象
    let rDateStr = /\d{4}[/-]\d{1,2}[/-]\d{1,2}/g; // 简单的日期格式校验：2020/12/19
    if (!rDateStr.test(start)) {
        console.log("请使用合法日期");
        return remainInfo;
    }
    sDate = new Date(start.replace("-", "/"));      //把我传进来的时间转为日期对象

    today = new Date();
    today = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
    dateDiff = sDate -today ;       //两个日期对象想减是毫秒数

    if (dateDiff < 0) {                 //如果今天在考试日期之后了
        console.log("请等待下一轮的备战吧");
        return remainInfo;
    }

    dateDiff = parseInt(dateDiff / oneDay);     //相差毫秒/一天的毫秒  那就是几天了
    remainInfo = dateDiff       //后续有需要  remainInfo改成对象
    return remainInfo;
}

const daytoList = (day)=>{          //将剩余天数转换成数组存储
    let list = [parseInt(day / 100),parseInt(day % 100 /10),parseInt(day % 10)]
    return list
}

export { todayInfo,daytoList }      //统一暴露