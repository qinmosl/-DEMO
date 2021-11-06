import React, { Component, } from 'react'
import { Calendar, Alert, Button, message } from 'antd';

import './index.scss'
import axios from 'axios'
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default class index extends Component {

    state = {
        //考研
        valueY: moment('2021-12-25'),
        selectedValueY: moment('2021-12-25'),
    };

    //点击选择日期回调
    onSelectY = value => {
        this.setState({
            valueY: value,
            selectedValueY: value,
        });
    };


    onPanelChange = (value, mode) => {  //日期面板变化回调      有点奇怪，好像是头上那个年月变换

    }


    //提交到服务器
    subMit = () => {

        let nowdate = new Date();
        //判断一下选择的日期距离今天是否超过990天，超过则不让他提交
        let setdate = this.state.selectedValueY.format('YYYY/MM/DD')    
        //Date.parse 解析字符串得到毫秒数 这里 - - 也可以
        let surplusday = parseInt((Date.parse(setdate) - nowdate) / 86400000);
        if (surplusday < 0) {
            message.warning("过去的就让他过去吧")
        } else if (surplusday > 990) { 
            message.warning("远方甚远，珍惜当下")
        } else {
            //将距离的时间提交服务器   传日期，不能传倒计时--  XXXX/XX/XX
            axios.post('https://www.standpoint.top/api/brserver/updatedb.php',
            `name=${localStorage.getItem('login_user')}&action=updatetime&time=${setdate}`,
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
                    } else {
                        message.error(response.data.message)
                    }
                },
                error => {
                    message.error("设置失败")
                }
            )

            
        }
    }

    //弹窗的关闭
    handleClose = (type) => {
        if (type === 'ok') {
            this.setState({ visibleok: false })
        }

    }

    render() {

        const { valueY, selectedValueY,  } = this.state; 
        return (
            <div className="calendar">
                <Alert
                    message={`选择的考研日期: ${selectedValueY && selectedValueY.format('YYYY-MM-DD')}`}
                />
                <div className="site-calendar-demo-card">
                    <Calendar locale={zhCN} value={valueY} fullscreen={false} onSelect={this.onSelectY} />
                </div>

                <Button type="primary" ghost className="submitbtn" onClick={this.subMit}> 提交保存 </Button>
            </div>
        )
    }
}
