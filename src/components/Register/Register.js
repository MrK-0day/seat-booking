import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Transition } from 'semantic-ui-react'
import { BoxBetween } from './index'

class Register extends Component {
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
Register.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  handleChange: PropTypes.func,
  onRegister: PropTypes.func
}

const mapState = state => { return state.Register }

const mapDispatch = dispatch => { return dispatch.Register }

export default withCookies(connect(mapState, mapDispatch)(withRouter(Register)))
