import React, { Component, } from 'react'
//函数库  用来函数防抖
import _ from 'lodash'
// import axios from 'axios'
import * as myaxios from '../../../utils/myaxios'
// import Pubsub from 'pubsub-js'
import SearchList from '../SearchList'
import './index.scss'
export class Search extends Component {

    state = {
        enter: false,       //切换搜索途径是否被选中
        datalist: [],       //查询到的提示数据
        searchmode: '百度', //搜索方式
        imgurl: [
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/baidu.png",  //百度
            "https://smartdl.lenovo.com.cn/assets/smart.newtab/image/ee4ab6de1c1.png",     //搜狗
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/bing.png"    //必应
        ],
        searchIndex: 0,       //第几张图片  下标是0
        openUrlList: [        //跳转的不同路径
            "http://www.baidu.com/s?wd=",
            "https://www.sogou.com/sogou?query=",
            "https://cn.bing.com/search?q="
        ]
    }

    myRef = React.createRef()

    //组件挂载完成
    componentDidMount() {
        let input = document.getElementById('q')
        input.focus();//自动获取页面焦点
    }

    changemode(data) {  //改变搜索方式
        console.log(data)
        if (data === 'baidu') {
            this.setState({ searchmode: '百度', searchIndex: 0 })
        } else if (data === 'sogou') {
            this.setState({ searchmode: '搜狗', searchIndex: 1 })
        } else {
            this.setState({ searchmode: '必应', searchIndex: 2 })
        }

    }

    Jsonp = () => {
        //输入调用各浏览器接口 返回提示值
        const { current: { value: keyWord } } = this.myRef   //连续解构赋值

        myaxios.jsonp(`https://suggestion.baidu.com/su?wd=${keyWord}`)      //无后面参数，不传
            .then(
                res => {
                    //console.log(res.s)
                    if (res.s instanceof Array) {
                        this.setState({ datalist: res.s })
                    }
                }
            )
            .catch(
                err => {
                    console.warn("出错了")
                }
            )
    }

    debounceJsonp = _.debounce(this.Jsonp,300)  //返回的是一个函数
    
    keyup = () => {
        if (this.myRef.current.value) {  //如果输入框有东西
            this.debounceJsonp()
        }
        //如果输入回车键，调用search
        if (window.event && window.event.keyCode === 13) {
            this.search()
        }
    }


    search = () => {      //点击搜索
        const { searchIndex, openUrlList } = this.state
        if (this.myRef.current.value) {  //如果输入框有东西
            let value = this.myRef.current.value
            // window.location.href="http://www.baidu.com/s?wd="+oQ.value+"";
            //用window.location.href方法不能在新窗口打开，因此改用window.open
            if (searchIndex === 0) {
                window.open(openUrlList[0] + value + "")   //百度
            } else if (searchIndex === 1) {
                window.open(openUrlList[1] + value + "")   //搜狗
            } else {
                window.open(openUrlList[2] + value + "")   //必应
            }
        } else {
            alert("请输入点什么吧|ू･ω･` )")
        }
    }

    mouseEnter = () => {   //移入
        this.setState({ enter: true })
    }

    mouseLeave = () => {   //移出
        this.setState({ enter: false })
    }

    render() {
        const { enter, datalist, searchmode, imgurl, searchIndex, openUrlList } = this.state
        return (
            <div className="search-over" >
                <div className="search">
                    <div className="left" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                        <span className="search-on"><span className="search-icon" style={{ backgroundImage: `url(${imgurl[searchIndex]})` }}></span>{searchmode}</span>
                    </div>
                    <div className="center">
                        <input ref={this.myRef} onKeyUp={this.keyup} autoComplete="off" type="text" id="q" />
                        <span className="speech"></span>
                    </div>
                    <div className="right" onClick={this.search}>
                        <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E6%90%9C%E7%B4%A2.png" title="搜索" alt="搜索"></img>
                    </div>
                </div>
                <ul className="search-list" style={{ display: enter ? 'block' : 'none' }} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                    <li onClick={() => this.changemode("baidu")}><span className="search-icon"></span>百度</li>
                    <li onClick={() => this.changemode("sogou")}><span className="search-icon"></span>搜狗</li>
                    <li onClick={() => this.changemode("bing")}><span className="search-icon"></span>必应</li>
                    {/* 事件绑定我们是委托的，发生后react去调用那个函数，我们不能直接调 */}
                </ul>
                <SearchList datalist={datalist} searchIndex={searchIndex} openUrlList={openUrlList} />
            </div>
        )
    }
}

export default Search
