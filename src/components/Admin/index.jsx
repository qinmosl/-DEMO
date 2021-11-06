import React, { Fragment, lazy, Suspense , } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { connect } from 'react-redux';
import {
  adminlogin,adminquit
} from '../../redux/actions/login'

import Loding from '../Loding'
const Login = lazy(() => import("../Login"))
const Home = lazy(() => import("../Home"))


const Admin = props=> {

  return (
    <Suspense fallback={<Loding />}>
      {/* 注册路由 */}
      {
        props.login ? 
        (
          <Fragment>
            <Route path="/home" component={Home} />
            <Redirect to="/home" />
          </Fragment>
        
        ) 
          : 
        (
          <Fragment>
            <Route path="/login" component={Login} />
            <Redirect to="/login" />
          </Fragment>
        )
        
      }

      {/* Redirect组件表示如果上面的路由都没有匹配上就去往我指定的to */}
    </Suspense>
  )
}


export default connect(
  state => ({
      login: state.log_re,
  }),
  {
    userlogin:adminlogin,
    userquit:adminquit
  }
)(Admin);