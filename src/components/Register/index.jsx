import React, { useState, useRef, useCallback } from 'react'
import { Form, Input, Button, message, Select } from 'antd';

import axios from 'axios'
//加密库
import CryptoJS from 'crypto-js'
//函数库  用来函数防抖
import _ from 'lodash'

const { Search } = Input;
const { Option } = Select;

export default function Register() {

    const onFinishFailed = (errorInfo) => {     //提交失败 比如没通过rule验证
        message.error('操作不规范，亲人两行泪');
    };

    const onFinishSingIn = (values) => {  //注册提交

        //先检验验证码是否正确 正确执行注册 注册成功 后期还得判断一手这个邮箱是否注册过
        axios.post(`https://www.standpoint.top/api/brserver/vercode.php`,
            `email=${values.email + "@" + type + ".com"}&code=${values.code}`
        ).then(
            response => {
                if (response.status === 200) {
                    if (response.data.code === 1) {

                        // 验证码校验成功进行注册
                        let pwdmd5 = CryptoJS.MD5(values.password).toString()
                        axios.post(`https://www.standpoint.top/api/brserver/record.php`,
                            `action=register&psd=${pwdmd5}&name=${values.username}&email=${values.email + "@" + type + ".com"}`
                        ).then(
                            response => {
                                if (response.status === 200) {
                                    if (response.data.code === 1) {
                                        message.success('用户注册成功啦，快去登录吧');
                                    } else {
                                        message.error(response.data.message)
                                    }
                                } else {
                                    message.error("网络连接异常")
                                }

                            },
                            error => {
                                message.error('网络出故障啦');
                            }
                        )

                    } else {
                        message.error(response.data.message)
                    }
                } else {
                    message.error("网络连接异常")
                }

            },
            error => {
                message.error('网络出故障啦');
            }
        )

    };

    const [type, setType] = useState("qq")
    const myRef = useRef()

    const sendemail = () => {
        message.warning("温馨提示:每10秒可以发送一次,不可重复操作哦")
        let email = myRef.current.state.value + "@" + type + ".com"
        axios.post(`https://www.standpoint.top/api/brserver/getcode.php`,
            `email=${email}&type=${type}`
        ).then(
            response => {
                if (response.status === 200) {
                    if (response.data.code === 1) {
                        message.success(response.data.message)
                    } else {
                        message.error(response.data.message)
                    }
                } else {
                    message.error("网络连接异常")
                }

            },
            error => {
                message.error('网络出故障啦');
            }
        )
    }

    const debounceSend = useCallback(
        _.debounce(
            sendemail, 
            10 * 1000,
            {
                'leading': true,    //延迟开始前被调用
                'trailing': false   //延迟那段时间狂点的结束后不调用
            }),
        []
    )

    const getCode = () => {
        
        let value = myRef.current.state.value
        if(value){
            if(value.length <5){
                message.error("邮箱格式不正确")
            }else{
                debounceSend()
            }
        }else{
            message.error("请填写邮箱")
        }
        
    }

    const onselect = type => setType(type)              //默认邮箱类型是qq

    const selectAfter = (
        <Select defaultValue="qq" className="select-after" onSelect={onselect}>
            <Option value="qq">@qq.com</Option>
            <Option value="163">@163.com</Option>
        </Select>
    );



    return (
        <Form className="sign-up-form"
            name="singIn"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinishSingIn}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <h2 className="form-title">注册</h2>
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
                label="邮箱"
                name="email"
                rules={[
                    {
                        required: true,
                        message: '请输入邮箱!',
                    },
                    {
                        pattern: /^[a-zA-Z0-9_-]{5,18}$/,
                        message: '请认真输入哦！',
                    },
                ]}
            >
                <Input addonAfter={selectAfter} ref={myRef} />
            </Form.Item>

            <Form.Item
                label="验证码"
                name="code"
                rules={[
                    {
                        required: true,
                        message: '请输入验证码!',
                    },
                    {
                        pattern: /^[a-zA-Z0-9]{1,}$/,
                        message: '不要输入花里胡哨的符号哦',
                    },
                ]}
            >
                <Search
                    placeholder="输入验证码"
                    allowClear
                    enterButton="发送验证码"
                    size="large"
                    onSearch={getCode}
                />
            </Form.Item>

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

                >立即注册</Button>
            </Form.Item>
        </Form>
    )
}
