import React, { } from 'react'
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios'

export default function Mymodal(props) {

    const { id, author, title, sentence, isModalVisible, setIsModalVisible, changeStoreData,setState ,state} = props

    //暂存数据 用来提交服务器
    const [upauthor, setAuthor] = React.useState(author)
    const [uptitle, setTitle] = React.useState(title)
    const [upsentence, setSentence] = React.useState(sentence)

    const handleOk = () => {    //点击确定
        setIsModalVisible(false);   //关闭弹窗
        //通过 id 进行修改记录
        axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
            `name=${localStorage.getItem('login_user')}&action=updatesent&id=${id}&author=${upauthor}&sentence=${upsentence}&title=${uptitle}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    "Authorization": localStorage.getItem('jwt')
                }
            }

        ).then(
            response => {
                if (response.data.code === 1) {
                  message.success(response.data.message)
                  setState(!state)  //刷新数据
                } else {
                  message.warning(response.data.message)
                }
            },
            error => {
                message.error("请求出错")
            }
        )
    };

    const handleCancel = () => {        //关闭弹窗  点×/点外面/点取消
        
        let initial = {
            id: -1,
            author: "",
            title: "",
            sentence: ""
        }
        changeStoreData({ ...initial })     //把父组件的要传的先置空
    };


    function handleValidator(rule, val, callback) {     //表单规则
        if (val) {
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

    function inputchange(e, field) {
        //通过onchange回调取值，useRef不行,只会取到上一次的
        if (field === "author") {
            setAuthor(e.target.value)
        }
        if (field === "title") {
            setTitle(e.target.value)
        }
        if (field === "sentence") {
            setSentence(e.target.value)
        }
    }

    return (

        <Modal title="修改句子" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消"
            style={{ top: "30%" }}
        >
            {/* 弹窗里面的表单 */}
            <Form
                name="alter"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 36 }}
                autoComplete="off"
            >
                {/* FormItem会得到一个initialValue,但是这个值只在组件挂载的时候执行了一次， 当我们再次打开Modal窗口的时候并不会更新 */}
                <Form.Item
                    label="作者"
                    name='author'
                    initialValue={author}  // 表单默认值
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

                    hasFeedback
                >
                    <Input placeholder="作者" onChange={(e) => inputchange(e, "author")} />
                </Form.Item>

                <Form.Item
                    label="书名"
                    name='title'
                    initialValue={title}  // 表单默认值
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
                >
                    <Input placeholder="书名" onChange={(e) => inputchange(e, "title")} />
                </Form.Item>

                <Form.Item
                    label="句子"
                    name='sentence'
                    initialValue={sentence}  // 表单默认值
                    rules={[
                        { required: true, message: '请填写句子' },
                        {
                            validator: handleValidator
                        },
                        {
                            max: 66,
                            message: '太长了少年！',
                        }
                    ]}

                    hasFeedback
                >
                    <Input placeholder="句子" onChange={(e) => inputchange(e, "sentence")} />
                </Form.Item>

            </Form>

        </Modal>

    )
}
