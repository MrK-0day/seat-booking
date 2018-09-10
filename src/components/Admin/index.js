import React from 'react'
import { Menu, Icon, Affix, Divider, Drawer, Form, Input, Modal, Radio } from 'antd'
import { Button, List, Image } from 'semantic-ui-react'
import pic from '../../images/3.png'

export const DHSMenu = ({props}) => {
  function onLogout () {
    props.onLogout(props.history)
  }
  return (
    <Menu
      mode='horizontal'
      onClick={props.handleClickMenu.bind(this)}
      selectedKeys={[props.current]}
    >
      <Menu.Item key='SettingRooms'>
        <Icon type='setting' />Setting
      </Menu.Item>
      <Menu.Item key='Schedule'>
        <Icon type='calendar' />Schedule
      </Menu.Item>
      <Menu.Item onClick={onLogout.bind(this)} style={{float: 'right'}} key='Logout'>
        <Icon type='logout' />
      </Menu.Item>
    </Menu>
  )
}

export const DHSMenuLock = ({props}) => {
  return (
    <Affix>
      <DHSMenu props={props} />
    </Affix>
  )
}

export const DividerAddRoom = ({props}) => {
  return (
    <Divider orientation='right'>
      <Button onClick={props.onOpenDrawerSetting.bind(this)} size='tiny' inverted color='green'>
        Add Room
      </Button>
    </Divider>
  )
}

export const DividerViewRoom = ({props}) => {
  return (
    <Divider orientation='left'>
      <Button onClick={props.onOpenDrawerView.bind(this)} size='tiny' inverted color='brown'>
        View Room
      </Button>
    </Divider>
  )
}

export const DrawerAddRoom = ({props}) => {
  return (
    <Drawer
      title='Add Room'
      placement='right'
      closable={false}
      onClose={props.onCloseDrawerSetting.bind(this)}
      visible={props.DrawerSetting}
    >
      <Form>
        <Form.Item>
          <Input onChange={props.handleChange.bind(this)} value={props.roomcode} name='roomcode' prefix={<Icon type='code-o' />} placeholder='Room code' />
        </Form.Item>
        <Form.Item>
          <Input onChange={props.handleChange.bind(this)} value={props.roomname} name='roomname' prefix={<Icon type='home' />} placeholder='Room name' />
        </Form.Item>
        <Form.Item>
          <Input onChange={props.handleChange.bind(this)} value={props.width} name='width' prefix={<Icon type='arrow-right' />} placeholder='Width' />
        </Form.Item>
        <Form.Item>
          <Input onChange={props.handleChange.bind(this)} value={props.length} name='length' prefix={<Icon type='arrow-down' />} placeholder='Length' />
        </Form.Item>
        <Form.Item>
          <Button onClick={props.onOpenModalConfig.bind(this)} floated='left' size='tiny' inverted color='red'>Config</Button>
          <Button onClick={props.OnComplete.bind(this)} floated='right' size='tiny' inverted color='blue'>Complete</Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export const DrawerViewRoom = ({props}) => {
  return (
    <Drawer
      title='View Room'
      placement='left'
      closable={false}
      onClose={props.onCloseDrawerView.bind(this)}
      visible={props.DrawerView}
      width={256 + 50}
    >
      <List divided animated verticalAlign='middle'>
        {props.listroom.length !== 0 && (
          <React.Fragment>
            {props.listroom.map((v, i) => {
              return (
                <List.Item key={i}>
                  <List.Content floated='right'>
                    <Button name={v.code} id={v._id} size='mini' color='green'>Edit</Button>
                  </List.Content>
                  <List.Content floated='right'>
                    <Button name={v.code} id={v._id} size='mini' color='red'>X</Button>
                  </List.Content>
                  <Image avatar src={pic} />
                  <List.Content>{v.name}</List.Content>
                </List.Item>
              )
            })}
          </React.Fragment>
        )}
      </List>
    </Drawer>
  )
}

export const ModalConfig = ({props}) => {
  function onPaint (e) {
    props.onPaint(e.target.id)
  }
  return (
    <Modal
      title={`Config ${props.roomname}`}
      visible={props.ModalConfig}
      onOk={props.onCloseOkModalConfig.bind(this)}
      onCancel={props.onCloseCancelModalConfig.bind(this)}
      bodyStyle={{
        padding: 0
      }}
      style={{ top: 20 }}
    >
      <div style={{
        width: '100%',
        textAlign: 'center',
        padding: 10
      }}>
        <Radio.Group onChange={props.onChangePen.bind(this)} value={props.pen}>
          <Radio value='seat'>Seat</Radio>
          <Radio value='lock'>Lock</Radio>
        </Radio.Group>
      </div>
      {props.room.length !== 0 && (
        <div>
          {props.room.map((r, i) => {
            return (
              <div key={i} style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
              }}>
                {r.map((c, j) => {
                  let color = null
                  switch (c.type) {
                    case 'floor':
                      color = '#3498db'
                      break
                    case 'seat':
                      color = '#2ecc71'
                      break
                    case 'lock':
                      color = '#e74c3c'
                      break
                    default:
                      color = null
                  }
                  return (
                    <div key={j} style={{
                      width: Math.floor(100 / props.width) + '%',
                      paddingTop: Math.floor(100 / props.width) + '%',
                      backgroundColor: color,
                      borderStyle: 'solid',
                      borderColor: '#ecf0f1',
                      borderWidth: 1
                    }} onClick={onPaint.bind(this)} id={`${i}-${j}`} />
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

export const Setting = ({props}) => {
  return (
    <div className='animated fadeIn fast'>
      <DividerAddRoom props={props} />
      <DividerViewRoom props={props} />
      <DrawerAddRoom props={props} />
      <DrawerViewRoom props={props} />
      <ModalConfig props={props} />
    </div>
  )
}

export const Schedule = ({props}) => {
  return (
    <div className='animated fadeIn fast'>abc</div>
  )
}
