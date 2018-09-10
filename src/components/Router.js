import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { withCookies } from 'react-cookie'

import '../css/theme.css'
import 'semantic-ui-css/semantic.min.css'
import '../css/animate.min.css'

// Import Components
import Home from './Home/Home'
import Register from './Register/Register'
import Admin from './Admin/Admin'
import DHS from './DHS/DHS'

class Router extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => {
            // const { cookies } = this.props
            // return cookies.get('DHS') ? <DHS /> : <Home />
            return <Home />
          }} />
          <Route exact path='/register' render={() => {
            return <Register />
          }} />
          <Route exact path='/admin' render={() => {
            // const { cookies } = this.props
            // return cookies.get('DHS') ? <DHS /> : <Admin />
            return <Admin />
          }} />
          <Route exact path='/DHS' render={() => {
            // const { cookies } = this.props
            // return cookies.get('DHS') ? <DHS /> : <Home />
            return <DHS />
          }} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default withCookies(Router)
