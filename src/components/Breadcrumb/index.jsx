
import React, { Component } from 'react'
import { Breadcrumb } from 'antd';
import { HomeOutlined,  } from '@ant-design/icons';
import './index.scss'

export default class breadcrumb extends Component {
    // 面包屑
    render() {
        return (

            <Breadcrumb>
                <Breadcrumb.Item href="">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                    <span>一层</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>二层</Breadcrumb.Item>
            </Breadcrumb>

        )
    }
}
