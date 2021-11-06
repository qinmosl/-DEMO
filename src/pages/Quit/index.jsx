import React from 'react'
import { Button, message } from 'antd';

import {delCookie} from '../../utils/cookie'

//引入actionCreator，专门用于创建action对象
import {
    adminquit
} from '../../redux/actions/login'

//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'

const  Quit = props=> {

    const quit = ()=>{
        props.quit()
        localStorage.removeItem('jwt');
        localStorage.removeItem('login_user');
        delCookie('expireIn')
        message.success(`退出成功`)
    }
    
    return (
        <Button type="primary" danger ghost onClick={quit}>
            退出登录
        </Button>
    )
}

export default connect(
    state => ({
        login: state.log_re,
    }),
    {
        quit:adminquit
    }
  )(Quit);