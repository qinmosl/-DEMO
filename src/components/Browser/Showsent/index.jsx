import React, { Component } from 'react'

//打字机效果
import Typed from 'typed.js';
import axios from 'axios'
import './index.scss'

export class Showsent extends Component {

    state = {
        sentence: [],
        rdsentence: "",
        showtyped :false
    }
    componentDidMount() {

        if (localStorage.getItem('login_user')) {
            axios.post('/api/brserver/selectdb.php',
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
                            sentlist.push([item.author, item.sentence, item.title])
                        })
                       
                        this.setState(
                            {
                                sentence: sentlist
                            },
                            ()=>{
                                this.returnonce(this.state.sentence)
                            }
                        )
                    } else {
                        //登录后句子是空也会走到这里 其实吧这边如果是空可以显示打字效果提示
                        let options = {
                            strings: [
                                '你已经登录啦',
                                '但是没有设置句子哦，可以到后台上传句子捏 ^3000',
                                "同时还可以上传头像以及时钟背景图呢 ^1000",
                            ],
                            typeSpeed: 50,   //打印速度
                            startDelay: 300, //开始之前的延迟300毫秒
                            loop: true,      //是否循环
                        };

                        this.setState({
                            showtyped:true
                        },()=>{
                            new Typed('#typed', options);
                        })
                        
                    }
                },
                error => {
                    this.setstaticsent()
                }
            )
        } else {
            this.setstaticsent()
        }


    }

    setstaticsent() {    //设置静态数据
        this.setState({
            sentence:
                [
                    ["史铁生", "且视他人之疑目如盏盏鬼火，大胆地去走你的夜路."],
                    ["余光中《寻李白》", "酒入豪肠，七分酿成了月光。余下三分啸成剑气，绣口一吐，就半个盛唐."],
                    ["杨绛", "无论人生上到哪一层台阶，阶下有人在仰望你，阶上亦有人在俯视你。你抬头自卑，低头自得，唯有平视，才能看见真实的自己."],
                    ["尼采", "谁终将声震人间，必长久深自缄默。谁终将点燃闪电，必长久如云漂泊."],
                    ["《文化苦旅》", "大智不群，大善无帮，何惧孤步，何惧毁谤."],
                    ["赵翼", "矮人看戏何曾见，都是随人说短长."],
                    ["叔本华", "每当人远航归来，他总有故事可说."],
                ]
        },()=>{
            this.returnonce(this.state.sentence)
        })
    }

    returnonce(list) {     //返回一个字符串
        if (list.length >= 1) {
            // random [0,1)
            let rdindex = parseInt(Math.random() * list.length) //parseInt第二个参数是进制  这就不用+1了，因为下标最大是length-1
            this.setState({
                rdsentence: `${list[rdindex][1]}   ——— ${list[rdindex][0]} ${list[rdindex][2] ? ' | ' + list[rdindex][2] : ''}`
            })
        }

    }

    render() {
        const { rdsentence ,showtyped} = this.state
        return (
            <div id="showsent">
                {
                    showtyped ?
                    <span id="typed"></span>
                    :
                    <span className="sentspan">
                        {
                            rdsentence
                        }
                    </span>
                }
                
            </div>
        )
    }
}

export default Showsent
