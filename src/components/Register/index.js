import React from 'react'
import { Form, Input, Icon, Button } from 'antd'
import { NavLink } from 'react-router-dom'
import { Logo, InputUser, InputPassword } from '../Home/index'

export const InputFirstname = ({props}) => {
  return (
    <Form.Item>
      <Input onChange={props.handleChange.bind(this)} name='firstname' value={props.firstname} prefix={<Icon type='user' />} type='text' placeholder='Firstname' />
    </Form.Item>
  )
}

export const InputLastname = ({props}) => {
  return (
    <Form.Item>
      <Input onChange={props.handleChange.bind(this)} name='lastname' value={props.lastname} prefix={<Icon type='user' />} type='text' placeholder='Lastname' />
    </Form.Item>
  )
}

export const ButtonRegister = ({props}) => {
  function onRegister () {
    props.onRegister(props)
  }
  return (
    <Form.Item>
      <Button onClick={onRegister.bind(this)} type='primary' ghost block>Register</Button>
    </Form.Item>
  )
}

export const Panel = ({props}) => {
  return (
    <div className='box-panel'>
      <Form>
        <InputFirstname props={props} />
        <InputLastname props={props} />
        <InputUser props={props} />
        <InputPassword props={props} />
        <ButtonRegister props={props} />
      </Form>
    </div>
  )
}

export const BoxBetween = ({props}) => {
  return (
    <div className='box-between'>
      <Logo />
      <Panel props={props} />
      <NavLink to='/'>Login Now !</NavLink>
    </div>
  )
}
