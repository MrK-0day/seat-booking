import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Transition } from 'semantic-ui-react'
import { DHSMenuLock, Setting, Schedule } from './index'

class Admin extends Component {
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
    this.props.setDefaultMenu('SettingRooms')
    this.props.initRoom()
    this.props.getListRoom()
  }
  render () {
    return (
      <Transition visible={this.state.visible} animation='scale' duration={300}>
        <div>
          <DHSMenuLock props={this.props} />
          {this.props.current === 'SettingRooms' && <Setting props={this.props} />}
          {this.props.current === 'Schedule' && <Schedule props={this.props} />}
        </div>
      </Transition>
    )
  }
}
Admin.propTypes = {
  current: PropTypes.string,
  handleClickMenu: PropTypes.func,
  setDefaultMenu: PropTypes.func
}

const mapState = state => { return state.Admin }

const mapDispatch = dispatch => { return dispatch.Admin }

export default withCookies(connect(mapState, mapDispatch)(withRouter(Admin)))
