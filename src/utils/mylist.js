function fixlist(list,item,maxlength){    

    if(maxlength !== null){                         //item从头插 ,从尾删除
        if(list.length >= maxlength ){ 
            let count = list.length-maxlength       //可不能直接在for循环用
            for(let i=0;i<=count;i++){
                list.pop()                          //返回值是末尾弹出的那个数字
            }
            return [item,...list]
        }else{
            return [item,...list]
        }
    }else{
        return [item,...list]
    }
    
}


export { fixlist }      //统一暴露