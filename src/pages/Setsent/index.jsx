import React, { Fragment } from 'react'
import axios from 'axios'
import { Alert, Form, Input, Button, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


const onFinish = values => {
    // console.log('提交的数据是:', values);
    // console.log(values.users.length)     
    values.users.forEach((item) => {
        let author = item.author
        let title = item.title?item.title:''
        let sent=item.sent
        axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
            `name=${localStorage.getItem('login_user')}&action=insertsent&sentence=${sent}&author=${author}&title=${title}`,
            // {
            //     name:'4444',
            //     action:'insertsent'
            // },
            {   //headers要放在params的后面，不能和params在一个参数中。加不加params都可以，看api规范
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    //提交的数据按照 key1=val1&key2=val2 的方式进行编码
                    "Authorization": localStorage.getItem('jwt')
                }
            }

        ).then(
            response => {
                if (response.data.code === 1) {
                    message.success("添加句子成功")
                } else {
                    message.error(response.data.message)
                }
            },
            error => {
                message.error("网络出故障了")
            }
        )
    })


};

export default function Setsent() {

    const [count, setCount] = React.useState(0) //控制添加的个数，到10就不给你add了
    const [show, setShow] = React.useState(false)  //弹窗出现与否

    function canadd() {
        if (count < 10) return true;
        else return false;
    }

    function myadd(fn) {
        fn();
        setCount(count => count + 1)
    }

    function handleValidator(rule, val, callback) {
        //新版的antd使用了React的hooks，表单中的字段效验方法进行了一些修改。原来的回调方法改成返回一个Promise对象
        if (val) {
            // const nameLength = getTextLength(value)
            // if (nameLength >= 4 && nameLength <= 30) {
            //     return Promise.resolve()
            // } else {
            //     return Promise.reject('名称长度为4-30个字符，一个中文字等于2个字符')
            // }
            let regx = new RegExp("[<>()]");
            let regx2 = /^.*script.*$/;
            if (regx.test(val)) {
                return Promise.reject('不可包含特殊符号')
            } else if (regx2.test(val.toLowerCase())) {   //转小写
                return Promise.reject('不可含有特殊字符串')
            } else {
                return Promise.resolve()
            }

        } else {
            return Promise.resolve()
        }

    }

    function close() {
        setShow(show => false)
    }
    return (
        <Fragment>
            <Alert
                message=""
                showIcon
                description="句子不能超过10个！"
                type="error"
                action={
                    <Button size="small" danger onClick={close}>关闭</Button>
                }
                style={{ display: show ? "" : "none" }}
            />
            <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.List name="users">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    {/* Space  对齐方式 中心对齐？ */}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'author']}
                                        fieldKey={[fieldKey, 'author']}
                                        rules={[
                                            { required: true, message: '请填写作者 无可填佚名' },
                                            {
                                                validator: handleValidator
                                            },
                                            {
                                                max: 12,
                                                message: '这么长的名不合适吧！',
                                            }
                                        ]}
                                        // validateStatus="success"
                                        hasFeedback
                                    >
                                        <Input placeholder="作者" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'title']}
                                        fieldKey={[fieldKey, 'title']}
                                        rules={[
                                            {
                                                validator: handleValidator
                                            },
                                            {
                                                max: 12,
                                                message: '这么长的名不合适吧！',
                                            }
                                        ]}
                                        hasFeedback
                                        help="书名可不写"
                                    >
                                        <Input placeholder="书名" />
                                    </Form.Item>


                                    <Form.Item
                                        {...restField}
                                        name={[name, 'sent']}
                                        fieldKey={[fieldKey, 'sent']}
                                        rules={[
                                            { required: true, message: '请填写句子' },
                                            // {
                                            //     pattern: /^1\d{10}( 1\d{10})*$/,
                                            //     message: '手机号格式不正确',
                                            // },
                                            {
                                                validator: handleValidator
                                            },
                                            {
                                                max: 66,
                                                message: '少年，你太长啦！',
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input placeholder="句子" style={{ minWidth: "500px" }} />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => { remove(name); setCount(count => count - 1) }} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={
                                    () => { canadd() ? myadd(add) : setShow(show => true) }
                                }
                                    block icon={<PlusOutlined />}> 再添加一句 </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        </Fragment>
    )
}
