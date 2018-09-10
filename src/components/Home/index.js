import React from 'react'
import { Form, Input, Icon, Button } from 'antd'
import { NavLink } from 'react-router-dom'
import logo from '../../images/3.png'

export const Logo = () => {
  return (
    <img alt='DHS' className='box-logo' src={logo} />
  )
}

export const InputUser = ({props}) => {
  return (
    <Form.Item>
      <Input onChange={props.handleChange.bind(this)} name='username' value={props.username} prefix={<Icon type='user' />} type='text' placeholder='Username' />
    </Form.Item>
  )
}

export const InputPassword = ({props}) => {
  return (
    <Form.Item>
      <Input onChange={props.handleChange.bind(this)} name='password' value={props.password} prefix={<Icon type='lock' />} type='password' placeholder='Password' />
    </Form.Item>
  )
}

export const ButtonLogin = ({props}) => {
  function onLogin () {
    props.onLogin(props)
  }
  return (
    <Form.Item>
      <Button onClick={onLogin.bind(this)} type='primary' ghost block>Login</Button>
    </Form.Item>
  )
}

export const Panel = ({props}) => {
  return (
    <div className='box-panel'>
      <Form>
        <InputUser props={props} />
        <InputPassword props={props} />
        <ButtonLogin props={props} />
      </Form>
    </div>
  )
}

export const BoxBetween = ({props}) => {
  return (
    <div className='box-between'>
      <Logo />
      <Panel props={props} />
      <NavLink to='/register'>Register Now !</NavLink>
    </div>
  )
}
