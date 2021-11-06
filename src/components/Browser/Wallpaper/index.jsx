import React, { Component, lazy ,Suspense } from 'react'
import {Route,Redirect} from 'react-router-dom'
import Pubsub from 'pubsub-js'
import { getStorage } from '../../../utils/cookie'
import { connect } from 'react-redux';
import {
  openthewallpaper,closethewallpaper
} from '../../../redux/actions/wallp'

import MyNavLink from '../MyNavLink'
import {HOT,WHITESTOCKING,ANIME,SCENERY,GODDESS,SIMPLE,CLEAN,JINLUN} from '../../../mock'
import './index.scss'

//这些需要放在最底下
import Loding from '../Loding'
import Hot from '../../../pages/hot'
import { message } from 'antd';
const Paperlist = lazy( ()=>import("../../../pages/paperlist"))
const History = lazy( ()=>import("../../../pages/history"))

class Wallpaper extends Component {

    state={
        previewurl:""     //背景皮肤预览效果
    }

    componentDidMount(){    //组件挂载
        this.token = Pubsub.subscribe('changepreview',(msg,stateobj)=>{    //订阅   来自pages的
            this.setState(stateobj)
        })
    }

    componentWillUnmount(){     //组件卸载前
        Pubsub.unsubscribe(this.token)  //关闭订阅
    }

    closeWapper = (event) => {     //关闭
        // console.log(event.target) //触发事件的元素
        //console.log(event.currentTarget)  //绑定事件的元素
        // event.nativeEvent.stopImmediatePropagation();
        this.props.closew()
    }

    nonusebgimg = ()=>{     //不使用壁纸
        Pubsub.publish('changepreview',{previewurl:""})         //发布给自己，让预览图片为空
        Pubsub.publish('changebgimg',{bgimgurl:""})             //发布到App.js  改变背景图片为空
    }

    custom =()=>{   //自定义
        if(!getStorage('login_user')){
            message.success("可以登录后上传哦")
        }
    }

    render() {
        let show = this.props.onoff
        let {previewurl} =this.state
        const {bgimgurl} = this.props  
        previewurl = previewurl? previewurl :bgimgurl?bgimgurl:""   //刷新页面那我就用父组件传来的url
        return (
            <div className="overshade" style={{ display: show ? 'block' : 'none' }} onClick={this.closeWapper}>
                <div className="wallPaper" onClick={e => e.stopPropagation()}>  {/* 防止冒泡 */}
                    <div className="left_top">
                        <ul>
                            {/* 可以换成一个路由，然后传值，因为格式都一样，图片不同罢了 */}
                            <li><MyNavLink to={ {pathname:"/br/hot",state:{imgurl:HOT}} }>热门</MyNavLink></li>
                            <li><MyNavLink to={ {pathname:"/br/whitestocking",state:{imgurl:WHITESTOCKING}} }>白丝</MyNavLink></li>
                            <li><MyNavLink to={ {pathname:"/br/anime",state:{imgurl:ANIME}} }>二次元</MyNavLink></li> 
                            <li><MyNavLink to={ {pathname:"/br/goddess",state:{imgurl:GODDESS}} }>女神</MyNavLink></li>              
                            <li><MyNavLink to={ {pathname:"/br/scenery",state:{imgurl:SCENERY}} }>风景</MyNavLink></li>      
                            <li><MyNavLink to={ {pathname:"/br/simple",state:{imgurl:SIMPLE}} }>简约</MyNavLink></li>        
                            <li><MyNavLink to={ {pathname:"/br/clean",state:{imgurl:CLEAN}} }>小清新</MyNavLink></li>
                            <li><MyNavLink to={ {pathname:"/br/jinlun",state:{imgurl:JINLUN}} }>金轮</MyNavLink></li>
                            <li><div className="shu"></div></li>
                            <li onClick={this.custom}>自定义</li>
                            <li> <MyNavLink to="/br/history">最近使用</MyNavLink> </li>
                        </ul>
                        <div className="setting">
                            <div className="nonuse-wp">
                                <span>⊘</span>
                                <span onClick={this.nonusebgimg}>不使用壁纸</span>
                            </div>
                            <div className="close-wp" onClick={this.closeWapper}>×</div>
                        </div>
                    </div>
                
                    {/* 通过<Suspense>指定在加载得到路由打包文件前显示一个自定义loading界面  */}
                    <Suspense fallback={<Loding/>}>
                        {/* 注册路由 */}
                        <Route path="/br/hot" component={Hot} />    
                        {/* 想办法把他搞掉，因为页面加载直接就是这个路由了，不能不传值啊 */}
                        <Route path="/br/whitestocking" component={Paperlist} />
                        <Route path="/br/anime" component={Paperlist} />
                        <Route path="/br/goddess" component={Paperlist} />
                        <Route path="/br/scenery" component={Paperlist} />
                        <Route path="/br/simple" component={Paperlist} />
                        <Route path="/br/clean" component={Paperlist} />
                        <Route path="/br/jinlun" component={Paperlist} />
                        <Route path="/br/history" component={History} />
                        <Redirect to="/br/hot" />
                        {/* Redirect组件表示如果上面的路由都没有匹配上就去往我指定的to */}
                    </Suspense>
                    <div className="right" style={{ backgroundImage:`url(${previewurl})`}}></div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        onoff: state.wall_re,
    }),
    {
      openw:openthewallpaper,
      closew:closethewallpaper
    }
  )(Wallpaper);