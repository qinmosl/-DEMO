import React, { Component } from 'react'
import axios from 'axios'
import Pubsub from 'pubsub-js'
import { todayInfo, daytoList } from '../../../utils/timefun'
import './index.scss'
export default class Countdown extends Component {

    state = {
        countdownmode: "高考",
        showcountdown: false,
        Ycountdown: ''
    }
    componentDidMount() {
        if (localStorage.getItem('login_user')) {
            axios.post('/api/brserver/selectdb.php',
                `name=${localStorage.getItem('login_user')}&action=selecttime`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        "Authorization": localStorage.getItem('jwt')
                    }
                }

            ).then(
                response => {
                    if (response.data.code === 1) {
                        // console.log(response)
                        this.setState({
                            Ycountdown: response.data.data.data[0].time
                        })
                    }
                },
            )
        }

        this.token = Pubsub.subscribe('changecountdown', (msg, stateobj) => {    //订阅  Topmenu的事件  改变该组件模式
            this.setState(stateobj)
        })
    }

    componentWillUnmount() {     //组件卸载前
        Pubsub.unsubscribe(this.token)  //关闭订阅
    }

    render() {
        const { countdownmode, showcountdown, Ycountdown } = this.state
        let itemlist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        let timelist = [0, 0, 0]  //初始 0 0 0
        //可以考虑当前年月拼接字符串
        if (countdownmode === "高考") {
            timelist = daytoList(todayInfo("2022/6/27"))   //高考
        } else {
            timelist = daytoList(Ycountdown === '' ? todayInfo("2021/12/25") : todayInfo(Ycountdown))   //考研
        }

        return (
            <div className="countdown" style={{ display: showcountdown ? "" : "none" }}>
                <div className="cd-item-text">
                    距离
                    <span>{countdownmode}</span>
                    还有
                </div>
                <div className="cd-item">
                    <ul className="hundreds" style={{ top: `-${timelist[0] * 100}px` }}>
                        {
                            itemlist.map((item) => {
                                return <li key={item}>{item}</li>
                            })
                        }
                    </ul>
                </div>
                <div className="cd-item">
                    <ul className="tens" style={{ top: `-${timelist[1] * 100}px` }}>
                        {
                            itemlist.map((item) => {
                                return <li key={item}>{item}</li>
                            })
                        }
                    </ul>
                </div>
                <div className="cd-item">
                    <ul className="units" style={{ top: `-${timelist[2] * 100}px` }}>
                        {
                            itemlist.map((item) => {
                                return <li key={item}>{item}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
