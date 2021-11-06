import React, { useState, lazy, Suspense } from 'react'
import { Route, Redirect,NavLink } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    RocketOutlined,
    EditOutlined,
    UploadOutlined,
    LogoutOutlined
} from '@ant-design/icons';

// import Breadcrumb from '../Breadcrumb'

import './index.scss'

import Calendar from "../../pages/Calendar"
import Loding from '../Loding'
const Setclock = lazy(() => import("../../pages/Setclock"))
const Setsent = lazy(() => import("../../pages/Setsent"))
const Showsent = lazy(() => import("../../pages/Showsent"))
const Uploadbg = lazy(() => import("../../pages/Uploadbg"))
const Quit = lazy(() => import("../../pages/Quit"))
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;


export default function Home() {

    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout className="home" >
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" style={{ textAlign: 'center' }}>听雨客舟中</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<RocketOutlined />}>
                        <NavLink to="/home/calendar">倒计时设置</NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={< UploadOutlined />}>
                        <NavLink to="/home/setclock">配置时钟与头像</NavLink>
                    </Menu.Item>

                    <SubMenu key="sub1" icon={<EditOutlined />} title="句子展示">
                        <Menu.Item key="3">
                            <NavLink to="/home/setsent">自定义展示句子</NavLink>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <NavLink to="/home/showsent">句子列表</NavLink>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="5" icon={< UploadOutlined />}>
                        <NavLink to="/home/uploadbg">自定义背景图片</NavLink>
                    </Menu.Item>

                    <Menu.Item key="6" icon={<LogoutOutlined />}>
                        <NavLink to="/home/quit">退出登录</NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout className="site-layout">
                <Header className="site-layout-background" >
                    {
                        React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: toggle,
                        })
                    }

                    {/* <Breadcrumb style={{ float: "right" }} /> */}
                </Header>

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {/* 通过<Suspense>指定在加载得到路由打包文件前显示一个自定义loading界面  */}
                    <Suspense fallback={<Loding />}>
                        {/* 注册路由 */}
                        <Route path="/home/calendar" component={Calendar} />
                        <Route path="/home/setclock" component={Setclock} />
                        <Route path="/home/setsent" component={Setsent} />
                        <Route path="/home/showsent" component={Showsent} />
                        <Route path="/home/uploadbg" component={Uploadbg} />
                        <Route path="/home/quit" component={Quit} />
                        <Redirect to="/home/calendar" />
                        {/* Redirect组件表示如果上面的路由都没有匹配上就去往我指定的to */}
                    </Suspense>

                </Content>
            </Layout>

        </Layout>
    )
}
