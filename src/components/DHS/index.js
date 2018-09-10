import React from 'react'
import { Menu, Icon, Affix, Row, Col, Select, DatePicker, Modal } from 'antd'
import { Button, Popup, Header } from 'semantic-ui-react'

export const DHSMenu = ({props}) => {
  function onLogout () {
    props.onLogout(props)
  }
  return (
    <Menu
      mode='horizontal'
      onClick={props.handleClickMenu.bind(this)}
      selectedKeys={[props.current]}
    >
      <Menu.Item key='SeatBooking'>
        <Icon type='line-chart' />Seat Booking
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

export const ContentDHS = ({props}) => {
  let tmp = ''
  if (props.listroom.length !== 0) {
    tmp = props.listroom[0].name
  }
  function onChangeRoom (value) {
    props.setState('roomname', value.split('_')[0])
    props.setState('roomid', value.split('_')[1])
  }
  function onChangeDate (dateString) {
    let date = dateString.format('DD-MM-YYYY')
    props.setState('date', date)
  }
  function onPickSeat () {
    props.onOpenModalPickSeat()
    props.onPickSeat()
  }
  return (
    <div style={{padding: 10}}>
      <Row gutter={24}>
        <Col span={12}>
          <Select onChange={onChangeRoom.bind(this)} placeholder='Select room' defaultValue={tmp} style={{minWidth: '100%'}}>
            {props.listroom.map((v, i) => {
              return (<Select.Option key={i} value={`${v.name}_${v._id}`}>{v.name}</Select.Option>)
            })}
          </Select>
        </Col>
        <Col span={12}>
          <DatePicker onChange={onChangeDate.bind(this)} placeholder='Select a day' />
        </Col>
      </Row>
      <div style={{padding: 5}} />
      <Row gutter={24}>
        <Col span={24}>
          <Button onClick={onPickSeat.bind(this)} floated='right' primary>Pick Seat</Button>
        </Col>
      </Row>
    </div>
  )
}

export const ModalPickSeat = ({props}) => {
  function pickSeat (event) {
    props.onPick(event.target.id.split('-'))
  }
  function onRemovePick (event) {
    props.onRemovePick(event.target.id.split('-'))
  }
  function OnUpdatePick (event) {
    props.OnUpdatePick(event.target.id.split('-'))
  }
  return (
    <Modal
      title={`Config ${props.roomname}`}
      visible={props.ModalPickSeat}
      onOk={props.onCloseOkModalPickSeat.bind(this)}
      onCancel={props.onCloseCancelModalPickSeat.bind(this)}
      bodyStyle={{
        padding: 0
      }}
      style={{ top: 20 }}
    >
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
                  if (c.am === true || c.pm === true) {
                    color = '#f1c40f'
                  }
                  if (c.type === 'seat') {
                    if (!c.full) {
                      const { cookies } = props
                      let uid = cookies.get('_ID')
                      return (
                        <Popup key={j} position='top right' on='hover' hoverable flowing trigger={
                          <div style={{
                            width: Math.floor(100 / props.width) + '%',
                            paddingTop: Math.floor(100 / props.width) + '%',
                            backgroundColor: color,
                            borderStyle: 'solid',
                            borderColor: '#ecf0f1',
                            borderWidth: 1
                          }} />
                        }>
                          <Header as='h6'>{`Select session for seat (${i}_${j})`}</Header>
                          {c.am && (
                            <div>
                              <Button onClick={OnUpdatePick.bind(this)} color='blue' id={`${i}-${j}-${c._id}-${c.idschedule}-PM-${c.userId}`}>PM</Button>
                              {uid === c.userId && <Button onClick={OnUpdatePick.bind(this)} color='green' id={`${i}-${j}-${c._id}-${c.idschedule}-FULL-${c.userId}`}>FULL</Button>}
                              {uid === c.userId && <Button onClick={onRemovePick.bind(this)} color='red' id={`${i}-${j}-${c._id}-${c.idschedule}-|-${c.userId}`}>DELETE</Button>}
                            </div>
                          )}
                          {c.pm && (
                            <div>
                              <Button onClick={OnUpdatePick.bind(this)} color='orange' id={`${i}-${j}-${c._id}-${c.idschedule}-AM-${c.userId}`}>AM</Button>
                              {uid === c.userId && <Button onClick={OnUpdatePick.bind(this)} color='green' id={`${i}-${j}-${c._id}-${c.idschedule}-FULL-${c.userId}`}>FULL</Button>}
                              {uid === c.userId && <Button onClick={onRemovePick.bind(this)} color='red' id={`${i}-${j}-${c._id}-${c.idschedule}-|-${c.userId}`}>DELETE</Button>}
                            </div>
                          )}
                          {c.am === false && c.pm === false && (
                            <div>
                              <Button onClick={pickSeat.bind(this)} color='orange' id={`${i}-${j}-${c._id}-AM`}>AM</Button>
                              <Button onClick={pickSeat.bind(this)} color='blue' id={`${i}-${j}-${c._id}-PM`}>PM</Button>
                              <Button onClick={pickSeat.bind(this)} color='green' id={`${i}-${j}-${c._id}-FULL`}>FULL</Button>
                            </div>
                          )}
                        </Popup>
                      )
                    } else {
                      // console.log(c)
                      const { cookies } = props
                      let uid = cookies.get('_ID')
                      if (uid === c.userId) {
                        return (
                          <div key={j} style={{
                            width: Math.floor(100 / props.width) + '%',
                            paddingTop: Math.floor(100 / props.width) + '%',
                            backgroundColor: '#34495e',
                            borderStyle: 'solid',
                            borderColor: '#ecf0f1',
                            borderWidth: 1
                          }} onClick={onRemovePick.bind(this)} id={`${i}-${j}-${c._id}-${c.idschedule}-${c.userId}`} />
                        )
                      } else {
                        return (
                          <div key={j} style={{
                            width: Math.floor(100 / props.width) + '%',
                            paddingTop: Math.floor(100 / props.width) + '%',
                            backgroundColor: '#34495e',
                            borderStyle: 'solid',
                            borderColor: '#ecf0f1',
                            borderWidth: 1
                          }} id={`${i}-${j}-${c._id}-${c.idschedule}-${c.userId}`} />
                        )
                      }
                    }
                  }
                  return (
                    <div key={j} style={{
                      width: Math.floor(100 / props.width) + '%',
                      paddingTop: Math.floor(100 / props.width) + '%',
                      backgroundColor: color,
                      borderStyle: 'solid',
                      borderColor: '#ecf0f1',
                      borderWidth: 1
                    }} id={`${i}-${j}-${c._id}`} />
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

export const SeatBooking = ({props}) => {
  return (
    <div className='animated fadeIn fast'>
      <ContentDHS props={props} />
      <ModalPickSeat props={props} />
    </div>
  )
}
