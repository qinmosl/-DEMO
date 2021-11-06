import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

import './index.scss'

export default class MyNavLink extends Component {
    render() {
        return (
            <NavLink activeClassName="select"  className="list-group-item" {...this.props}></NavLink>
        )
    }
}
