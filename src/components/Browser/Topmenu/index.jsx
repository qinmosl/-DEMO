import React, { Component } from 'react'
import { Switch } from 'antd';

// //引入store，用于获取redux中保存状态
// import store from '../../../redux/store'
// //引入actionCreator，专门用于创建action对象
// import {openthewallpaper,closethewallpaper} from '../../../redux/wallp_action'

import { connect } from 'react-redux';
import {
  openthewallpaper,closethewallpaper
} from '../../../redux/actions/wallp'

import Pubsub from 'pubsub-js'

import './index.scss'
class Topmenu extends Component {

    state ={ 
        disabledGk:false ,      //高考倒计时是否禁用
        disabledKy:false  ,     //考研倒计时是否禁用
        menuenter:false  ,      //菜单是否被选中
    } 

    toggle = (who) => {    //切换  state的元素值

        const {disabledGk,disabledKy} = this.state
        if(who === 'GK'){    //高考开关变化 则让考研开关禁用值改变
            this.setState({disabledKy:!disabledKy})
        }else{
            this.setState({disabledGk:!disabledGk})
        }
        
    };

    countChange=(checked)=>{    // 高考倒計時
        this.toggle('GK')
        //展示高考倒计时
        if(checked === true){
            Pubsub.publish('changecountdown',{showcountdown:true,countdownmode:"高考"})
        }else{
            Pubsub.publish('changecountdown',{showcountdown:false,countdownmode:"高考"})
        }
    }
    countChange2=(checked)=>{   //考研倒計時
        this.toggle('KY')
        //展示考研倒计时
        if(checked === true){
            Pubsub.publish('changecountdown',{showcountdown:true,countdownmode:"考研"})
        }else{
            Pubsub.publish('changecountdown',{showcountdown:false,countdownmode:"考研"})
        }
    }

    darkmode=(checked)=>{       //夜间模式
        if(checked){
            console.log("打开夜间模式")
        }else{
            console.log("关闭夜间模式")
        }
            
    }

    onChange =(checked)=> {        //添加桌面快捷
        if(checked){
            window.open("https://www.standpoint.top/canvas/test.php")
        }
        
    }

    changewallpaper = (checked) =>{     //更换壁纸
        if(checked === true) {
            this.props.openw()      
        }else{   
            this.props.closew()
        }
    }


    mouseEnter = ()=>{   //移入菜单列表
        this.setState({menuenter:true})
    }

    mouseLeave =()=>{   //移出菜单列表
        this.setState({menuenter:false})
    }


    render() {
        const {disabledGk,disabledKy,menuenter} =this.state
        const {imgenter} =this.props
        return (
            <div id="topmenu" style={{ display:imgenter?'block':menuenter?'block':'none'}} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <ul>
                    <li> 
                        <span> <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E5%80%92%E8%AE%A1%E6%97%B6.png" alt="倒计时"></img></span>
                        高考倒計時
                        <Switch  disabled={disabledGk} onChange={this.countChange} size="small"/>
                    </li>
                    <li>
                        <span> <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E5%80%92%E8%AE%A1%E6%97%B6%20(1).png" alt="倒计时"></img></span>
                        考研倒計時
                        <Switch  disabled={disabledKy} onChange={this.countChange2} size="small"/>
                    </li>
                    <li>
                        <span> <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.png" alt="模式"></img></span>
                        夜間模式
                        <Switch  onChange={this.darkmode} size="small"/>
                    </li>
                    <li>
                        <span> <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E5%9B%BE%E7%89%87.png" alt="壁纸"></img></span>
                        更換壁紙
                        <Switch checked={this.props.onoff} onChange={this.changewallpaper} size="small"/>
                    </li>
                    <li>
                        <span> <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E7%AE%80%E5%8D%95.png" alt="快捷"></img></span>
                        桌面快捷
                        <Switch  onChange={this.onChange} size="small"/>    
                        {/* defaultChecked */}
                    </li>
                </ul>
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
  )(Topmenu);
