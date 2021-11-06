import React, { useState } from 'react'
import { Form, Input, Button, message, } from 'antd';

import axios from 'axios'
//加密库
import CryptoJS from 'crypto-js'

//引入actionCreator，专门用于创建action对象
import {
    adminlogin, adminquit
} from '../../redux/actions/login'

//引入connect用于连接UI组件与redux
import { connect } from 'react-redux'

import './index.scss'
import Vercode from '../Vercode';
import Register from '../Register';

const Login = props => {

    const [singup, setSingup] = useState(false)
    const [code, setCode] = useState('')

    const singUp = () => {
        setSingup(true)

    }
    const singIn = () => {
        setSingup(false)
    }

    const onFinish = (values) => {  //登录提交成功
        if(code!==''){
        }

        if (values.code.toLowerCase() !== code.toLowerCase()) {    //转小写比较
            message.error('验证码错误')
        } else {
            let pwdmd5 = CryptoJS.MD5(values.password).toString()
            axios.post(`https://www.standpoint.top/api/brserver/record.php`,
                `action=login&psd=${pwdmd5}&name=${values.username}`
            ).then(
                response => {
                    if (response.status === 200) {
                        // console.log(response)
                        if (response.data.code === 1) {
                            // 本地存储jwt
                            localStorage.setItem('jwt', response.data.data.jwt);
                            localStorage.setItem('login_user', response.data.data.username);
                            props.login()   //redux更改状态
                            let timestamp = new Date().getTime() + 60 * 60 * 24 * 1000;
                            document.cookie = 'expireIn=' + timestamp;   //保存cookie 到期时间1天后 
                            message.success(`欢迎你${localStorage.getItem('login_user')}`);
                        } else {
                            // props.quit()
                            message.error(response.data.message)
                        }
                    } else {
                        // props.quit()
                        message.error("网络连接异常")
                    }
                },
                error => {
                    // props.quit()
                    message.error('网络出故障啦');
                }
            )
        }


    };

  
    const onFinishFailed = (errorInfo) => {     //提交失败 比如没通过rule验证
        message.error('操作不规范，亲人两行泪');
    };


    return (
        <div className={`box ${singup ? 'sign-up-mode' : ""}`} >
            <div className="form-warp">
                <Form className="sign-in-form"
                    name="login"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h2 className="form-title">登录</h2>
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                            {
                                pattern: /^[a-zA-Z0-9_-]{3,16}$/,
                                message: '用户名为3-16位数字字母下划线',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密　码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                            {
                                pattern: /^[a-zA-Z0-9_-]{6,18}$/,
                                message: '密码为为6-18位数字字母下划线',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                            {
                                pattern: /^[a-zA-Z0-9]{1,}$/,
                                message: '不要输入花里胡哨的符号哦',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Vercode setcode={setCode}/>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit"
                            style={{
                                borderRadius: "30px",
                                border: "2px solid #6266f5",
                            }}

                        >立即登录</Button>
                    </Form.Item>
                </Form>

                {/* 注册 */}
                <Register/>
            </div>

            <div className="desc-warp">
                <div className="desc-warp-item sign-up-desc">
                    <div className="content">
                        <button className="loginbtn" onClick={singUp}>注册</button>
                    </div>
                    <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/admin/log.svg" alt="" />
                </div>

                <div className="desc-warp-item sign-in-desc">
                    <div className="content">
                        <button className="loginbtn" onClick={singIn}>登录</button>
                    </div>
                    <img src="https://react-1305405728.cos.ap-nanjing.myqcloud.com/admin/register.svg" alt="" />
                </div>
            </div>
        </div >
    )
}

export default connect(
    state => ({
        login: state.log_re,
    }),
    {
        login: adminlogin,
        quit: adminquit
    }
)(Login);
