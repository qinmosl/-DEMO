import React, { Component } from 'react'
import Topmenu from '../Topmenu'
import './index.scss'

export class Header extends Component {

    state ={
        imgenter:false, //菜单图标是否被选中
        loginUser:''  //是否有登录
    }

    mouseEnter = ()=>{   
        this.setState({imgenter:true})
    }

    mouseLeave =()=>{
        this.setState({imgenter:false})
    }

    componentDidMount(){
        if (localStorage.getItem('login_user')){
            this.setState({
                loginUser:localStorage.getItem('login_user')
            })
        }
    }
    toLogin = ()=>{
       window.open("https://www.standpoint.top/login")
    }
    
   
    render() {
        const {imgenter,loginUser} =this.state
        return (
            <div className="top">         
                <div className="top_left">
                   <iframe title="ifr" className="iframe" src="https://i.tianqi.com/index.php?c=code&a=getcode&id=34&h=20&w=280" frameBorder="0" scrolling="no" hspace="0" height="20"></iframe>
                </div>

                <div className="top_right">
                    {/* href="https://onlyshu.top" */}
                    <div className="top_login" onClick={this.toLogin} > 
                       <span className="top_img_wrapper">
                           <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E7%99%BB%E5%BD%95.png"  alt="头像"></img>
                        </span>
                       <span className={ loginUser === ''? 'no_login' :'on_login'}>
                        {
                            // 登录了展示QQ昵称 否则展示QQ登录图标
                            loginUser === '' ?"登录" : loginUser
                        }
                       </span>
                    </div>
                    <div className="top_menu" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                        <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/icon/%E8%8F%9C%E5%8D%95.png" title="菜单" alt="菜单"></img>
                    </div>

                    <Topmenu imgenter={imgenter}/>
                </div>
                
            </div>
        )
    }
}

export default Header
