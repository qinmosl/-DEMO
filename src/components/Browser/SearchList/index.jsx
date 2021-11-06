import React, { Component } from 'react'

import './index.scss'

export default class SearchList extends Component {

    // state = { showlist: true }
    // liclick = (event) => {
    //     console.log(event.target.tagName)
    //     if (event.target.tagName !== 'A') {
    //         console.log(this.state)
    //         this.setState({ showlist: false })
    //     }
    // }
    render() {
        // const { showlist } = this.state
        const { datalist,openUrlList,searchIndex } = this.props
        return (

            <div className="listother">
                <ul className="datalist">
                    {
                        datalist.map((item, index) => {
                            return <li key={index}>
                                {/* target="_blank" 另开页面会有安全隐患*/}
                                <a rel="noopener" href={`${openUrlList[searchIndex]}${item}`}  target="_blank"> {item} </a>
                            </li>
                        })
                    }
                </ul>
            </div>

        )
    }
}
