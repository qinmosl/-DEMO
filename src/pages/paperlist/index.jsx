import React, { Component } from 'react'
import Pubsub from 'pubsub-js'
import './index.scss'
export default class Hot extends Component {
    state ={
        imgurl:[]
    }

    componentDidMount(){
       const {imgurl} = this.props.location.state
       //console.log(imgurl)  //是个数组
       this.setState({
            imgurl  //es6语法
       })
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
