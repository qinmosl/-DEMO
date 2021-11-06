import React, { useState, Fragment, useEffect } from 'react'

import Pubsub from 'pubsub-js'
import { getStorage } from '../../utils/cookie'
import { fixlist } from '../../utils/mylist'

import Header from './Header'
import Showsent from "./Showsent";
import Search from './Search'
import Countdown from './Countdown'
import Wallpaper from './Wallpaper'
import Rightbar from './Rightbar'
import Clock from './Clock'

export default function Browser() {

    const [bgimgurl, setBgimgurl] = useState(getStorage('imgurl')?getStorage('imgurl'):'')    //背景图片    避免再次打开页面给整没了

    useEffect(() => {   //网页加载的时候去Storage里面拿背景图
        let storageurl = getStorage('imgurl')
        if (storageurl !== null) {
            setBgimgurl(storageurl)
        }

        let token = Pubsub.subscribe('changebgimg', (msg, stateobj) => {    //订阅   改变背景图
            setBgimgurl(stateobj.bgimgurl)      //{bgimgurl:item}
        })

        return () => {
            Pubsub.unsubscribe(token)  //关闭订阅
        }
    }, [])

    const isin =(list,url) =>{      //某个值是否存在数组中
        let flag = false;
        list.forEach((item) => {    //只能throw new Error('End')终止循环
            if(url ===item ) {
                flag = true
            }
        });
        return flag
    }

    useEffect(() => {   //背景图改变的时候
        
        document.getElementById('root').style["backgroundImage"] = `url(${bgimgurl}`;
        //保存到localStorage
        localStorage.setItem('imgurl', bgimgurl);    //存储选择的背景图

        if (bgimgurl) {      //刷新页面会有一个空值 不能放上面，因为还有一种清空背景图的情况
            let urllist = JSON.parse(getStorage('historyurl'))
            if (urllist && Array.isArray(urllist)) {
             
                if( isin(urllist,bgimgurl) ){        //不存在才添加

                }else{
                    let newhistory = fixlist(urllist, bgimgurl, 18)
                    localStorage.setItem('historyurl', JSON.stringify(newhistory));
                }
                
            } else {
                //storage只能存储字符串的数据,对于JS中常用的数组或对象却不能直接存储。
                //JSON.stringify(value[, replacer[, space]])
                //replacer 可以只输出所需的键
                //space:可选，文本添加缩进、空格和换行符  space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t
                localStorage.setItem('historyurl', JSON.stringify([bgimgurl])); //存储一份到historyurl数组
    
                //存： localStorage.setItem(‘weekDay’,JSON.stringify(weekArray));
                //取： weekArray = JSON.parse(localStorage.getItem(‘weekDay’));
            }
        }

    }, [bgimgurl]) 

    return (
        <Fragment>
            <Header />
            <Showsent />
            <Search />
            <Countdown />
            {/* 刷新后右侧展示图片和我背景图片同步 */}
            <Wallpaper bgimgurl={bgimgurl} />
            <Rightbar />
            <Clock />
        </Fragment>
    )
}
