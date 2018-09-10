import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { withCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Transition } from 'semantic-ui-react'
import { DHSMenuLock, SeatBooking } from './index'

class DHS extends Component {
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
    this.props.setDefaultMenu('SeatBooking')
    this.props.getListRoom()
    this.props.onLoading()
    const { cookies } = this.props
    this.props.setState('userId', cookies.get('_ID'))
  }
  render () {
    return (
      <Transition visible={this.state.visible} animation='scale' duration={300}>
        <div>
          <DHSMenuLock props={this.props} />
          {this.props.current === 'SeatBooking' && <SeatBooking props={this.props} />}
        </div>
      </Transition>
    )
  }
}
DHS.propTypes = {
}

const mapState = state => { return state.Dhs }

const mapDispatch = dispatch => { return dispatch.Dhs }

export default withCookies(connect(mapState, mapDispatch)(withRouter(DHS)))
