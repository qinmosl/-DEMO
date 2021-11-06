import React, { Fragment, useEffect,useState } from 'react'
import axios from 'axios'
import Mymoadal from '../../components/Mymodal'
import { Empty, Table, Tag, Space, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Showsent() {

    const [state, setState] = useState(true)    //左右横跳，控制useEffect再次请求数据

    const [data, setData] = useState([]) //数据

    const [show, setShow] = useState(true)  //有数据，则展示表格，否则展示empty

    const [isModalVisible, setIsModalVisible] = useState(false); //对话框 modal是否展示

    const [storeData, changeStoreData] = useState(
        //通过数据解构让传入的新值和原来的数组指向的不是同一片内存，才能触发dom的更新
        {
            id: -1, //给接口用 对某条记录增删改查
            author: "",
            title: "",
            sentence: ""
        }
    )

    useEffect(() => {
        axios.post('https://www.standpoint.top/api/brserver/selectdb.php',
            `name=${localStorage.getItem('login_user')}&action=selectsent`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    "Authorization": localStorage.getItem('jwt')
                }
            }

        ).then(
            response => {
                if (response.data.code === 1) {
                    let sentlist = [];
                    response.data.data.data.forEach((item) => {
                        sentlist.push(
                            {
                                key: item.id,
                                id: item.id,
                                author: item.title === '' ? [item.author] : [item.author, item.title],
                                sentence: item.sentence,
                            }
                        )
                    })
                    setData(sentlist)
                    setShow(false)

                } else {
                    setShow(true)
                }
            },
            error => {
                setShow(true)
            }
        )
    }, [state]);  


    useEffect(() => {
        // console.log(storeData)
        if (storeData.id === -1) {
            setIsModalVisible(false);  //关闭弹窗
        } else {
            //等storeData.id  被改变且不说 -1 才能让框显示
            setIsModalVisible(true);
        }

    }, [storeData.id]);

    // 修改句子的弹窗赋值  具体请求在组件那边
    const showModal = (record) => {
       
        let newstoreData = {
            id: record.id, //给接口用
            author: record.author[0],
            title: record.author[1] ? record.author[1] : "",
            sentence: record.sentence
        }
        changeStoreData({ ...newstoreData })  //数据解构指向不一样的地址 
        setIsModalVisible(true)     //弹窗显示  关闭的他会自动调   点击确定后赋值为false
    };


    //删除弹窗
    function confirm(id) {
        Modal.confirm({
            title: '删除提醒',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除本条数据吗',
            okText: '确认',
            cancelText: '取消',
            //   点击确定的回调
            onOk: () => { deletebykey(id) }
        });
    }

    //通过id删除某条句子
    function deletebykey(id) {
        // console.log(`删除id是  ${id}的句子`)
        axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
            `id=${id}&name=${localStorage.getItem('login_user')}&action=deletesent`,
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
                    setState(!state)    //刷新数据
                } else {
                    message.warning(response.data.message)
                }
            },
            error => {
                message.error("操作失败")
            }
        )
    }

    const columns = [     //规则
        {
            title: '句子',
            dataIndex: 'sentence',
            key: 'sentence',
            render: text => <span style={{ color: 'orange' }}>{text}</span>,  //渲染规则
        },
        {
            title: '作者 / 书名',
            key: 'author',
            dataIndex: 'author',
            render: authors => (       //因为这个参数本来传回来的是一个数组，有多个标签，但我这作者只有一个，也无妨
                <>
                    {authors.map(author => {
                        let regx = /^《.*》$/;
                        let color = regx.test(author) ? 'geekblue' : "green";
                        if (author === '佚名') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={author}>
                                {author.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record, index) => ( //参数分别为当前行的值，当前行数据，行索引  3个参数
                <Space size="middle">
                    <Button type="primary" ghost onClick={() => showModal(record)}>修改</Button>
                    <Button type="primary" danger ghost onClick={() => confirm(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    return (
        <Fragment>
            <Empty description="暂无数据  可去自定义添加" style={{ display: show ? "block" : "none" }} />
            <Table columns={columns} dataSource={data} style={{ display: show ? "none" : "" }} />

            {/* 修改句子信息的弹窗组件 */}
            {/* isModalVisible 值变化 使其重新挂载 这样里面只会初始化一次的东西可以再次初始化*/}
            {
                isModalVisible && 
                <Mymoadal {...storeData} setIsModalVisible={setIsModalVisible} changeStoreData={changeStoreData} isModalVisible={isModalVisible} setState={setState} state={state}/>
            }


        </Fragment>

    )
}
