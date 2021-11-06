import React, { Component } from 'react'
import Pubsub from 'pubsub-js'

import { getStorage } from '../../utils/cookie'
import './index.scss'
import { Fragment } from 'react'
export default class Hot extends Component {
    state = {
        imgurl: []
    }

    componentDidMount() {
        let historyurl = getStorage('historyurl')
        let imgurl = []
        if (historyurl) {
            imgurl = JSON.parse(historyurl)
        }
        this.setState({
            imgurl
        })
    }

    mouseEnter = (item) => {   //移入图片
        //发布消息 使订阅更新 改变state 从而改变预览图片
        Pubsub.publish('changepreview', { previewurl: item })
    }

    mouseLeave = () => {   //移出图片    
    }

    changebgimg = (item) => {    //点击改变背景图片
        Pubsub.publish('changebgimg', { bgimgurl: item })
    }

    render() {
        const { imgurl } = this.state

        return (
            <Fragment>
                {imgurl.length !== 0 ?
                    <div className="wallpaper-left">
                        {
                            imgurl.map((item, index) => {
                                return <div key={index}
                                    onMouseEnter={() => this.mouseEnter(item)} onMouseLeave={this.mouseLeave} onClick={() => this.changebgimg(item)}
                                    style={{ backgroundImage: `url(${item})` }}></div>
                            })
                        }
                    </div>
                    :
                    <div className="no_history">
                        还没有历史背景哦
                    </div>

                }
            </Fragment>
        )
    }
}
