import React, { Component } from 'react'
import Pubsub from 'pubsub-js'
import './index.scss'
export default class Hot extends Component {
    state ={
        imgurl:[
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-1.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-2.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-3.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-4.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-5.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-6.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-7.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-8.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-9.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-10.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-11.jpg",
            "https://react-1305405728.cos.ap-nanjing.myqcloud.com/browser/background/hot-12.jpg"
        ]
    }

    mouseEnter = (item)=>{   //移入图片
        //发布消息 使订阅更新 改变state 从而改变预览图片
        Pubsub.publish('changepreview',{previewurl:item})
    }

    mouseLeave =()=>{   //移出图片    
    }

    changebgimg=(item)=>{    //点击改变背景图片
        Pubsub.publish('changebgimg',{bgimgurl:item})
    }

    render() {
        const {imgurl} = this.state
        return (
            <div className="wallpaper-left">
                {
                    imgurl.map((item,index)=>{
                        return <div key={item}
                            onMouseEnter={()=>this.mouseEnter(item)} onMouseLeave={this.mouseLeave} onClick={()=>this.changebgimg(item)}
                            style={{ backgroundImage:`url(${item})`}} className={index===1?"aa":index===7?"bb":""}></div>
                    })
                }
            </div>
        )
    }
}
