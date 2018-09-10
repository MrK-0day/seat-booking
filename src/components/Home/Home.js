import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Transition } from 'semantic-ui-react'
import { BoxBetween } from './index'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  componentDidMount () {
    this.setState({
      visible: true
    })
  }
  render () {
    return (
      <Transition visible={this.state.visible} animation='zoom' duration={300}>
        <div><BoxBetween props={this.props} /></div>
      </Transition>
    )
  }
}
Home.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  handleChange: PropTypes.func,
  onLogin: PropTypes.func
}

const mapState = state => { return state.Home }

const mapDispatch = dispatch => { return dispatch.Home }

export default withCookies(connect(mapState, mapDispatch)(withRouter(Home)))
