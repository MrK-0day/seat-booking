// import { Client } from '../modules/apollo-fix'
import { Client } from '../modules/apollo'
import gql from 'graphql-tag'
const moment = require('moment')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

export const Home = {
  state: {
    username: 'tuan',
    password: '123'
  },
  reducers: {
    handleChange (state, event) {
      return {
        ...state,
        [event.target.name]: event.target.value
      }
    }
  },
  effects: (dispatch) => ({
    async onLogin (payload, rootState) {
      // payload.history.push('/DHS')
      // payload.history.push('/admin')
      let encryptPass = CryptoJS.SHA256(rootState.Home.password).toString().toUpperCase()
      let { data: { login: res } } = await Client.mutate({
        variables: {
          username: rootState.Home.username,
          password: encryptPass
        },
        mutation: gql`
          mutation login ($username: String!, $password: String!) {
            login (username: $username, password: $password) {
              errors sessionID token
            }
          }
        `
      })
      if (res.token === null) console.log(res.errors)
      else {
        // set cookies with name [DHS]
        let { sub: { _id: id } } = jwt.decode(res.token)
        const { cookies } = payload
        cookies.set('DHS', res.token, { path: '/' })
        cookies.set('_ID', id, { path: '/' })
        if (rootState.Home.username === 'admin') payload.history.push('/admin')
        else payload.history.push('/DHS')
      }
    }
  })
}

export const Register = {
  state: {
    username: '',
    password: '',
    firstname: '',
    lastname: ''
  },
  reducers: {
    handleChange (state, event) {
      return {
        ...state,
        [event.target.name]: event.target.value
      }
    }
  },
  effects: (dispatch) => ({
    async onRegister (payload, rootState) {
      payload.history.push('/')
      let encryptPass = CryptoJS.SHA256(rootState.Register.password).toString().toUpperCase()
      await Client.mutate({
        variables: {
          username: rootState.Register.username,
          password: encryptPass,
          firstname: rootState.Register.firstname,
          lastname: rootState.Register.lastname,
          isEnabled: true
        },
        mutation: gql`
          mutation addUser ($username: String!, $password: String, $imageUrl: String, $firstname: String, $lastname: String, $isEnabled: Boolean!) {
            addUser (username: $username, password: $password, imageUrl: $imageUrl, firstname: $firstname, lastname: $lastname, isEnabled: $isEnabled) {
              _id
            }
          }
        `
      })
    }
  })
}

export const Admin = {
  state: {
    roomcode: '',
    roomname: '',
    width: 8,
    length: 10,
    room: [],
    pen: 'seat',
    current: '',
    DrawerSetting: false,
    DrawerView: false,
    ModalConfig: false,
    listroom: []
  },
  reducers: {
    setState (state, key, value) {
      return {
        ...state,
        [key]: value
      }
    },
    initRoom (state) {
      let log = []
      for (let i = 0; i < state.length; i++) {
        let row = []
        for (let j = 0; j < state.width; j++) {
          row.push({
            type: 'floor'
          })
        }
        log.push(row)
      }
      return {
        ...state,
        room: log
      }
    },
    handleChange (state, event) {
      if (event.target.name === 'width' || event.target.name === 'length') {
        let log = []
        let width = event.target.name === 'width' ? event.target.value : state.width
        let length = event.target.name === 'length' ? event.target.value : state.length
        for (let i = 0; i < length; i++) {
          let row = []
          for (let j = 0; j < width; j++) {
            row.push({
              type: 'floor'
            })
          }
          log.push(row)
        }
        return {
          ...state,
          [event.target.name]: event.target.value,
          room: log
        }
      }
      return {
        ...state,
        [event.target.name]: event.target.value
      }
    },
    handleClickMenu (state, event) {
      return {
        ...state,
        current: event.key
      }
    },
    setDefaultMenu (state, payload) {
      return {
        ...state,
        current: payload
      }
    },
    onCloseDrawerSetting (state) {
      return {
        ...state,
        DrawerSetting: false
      }
    },
    onOpenDrawerSetting (state) {
      return {
        ...state,
        DrawerSetting: true
      }
    },
    onCloseDrawerView (state) {
      return {
        ...state,
        DrawerView: false
      }
    },
    onOpenDrawerView (state) {
      return {
        ...state,
        DrawerView: true
      }
    },
    onOpenModalConfig (state) {
      return {
        ...state,
        ModalConfig: true,
        DrawerSetting: false
      }
    },
    onCloseCancelModalConfig (state) {
      let log = []
      for (let i = 0; i < state.length; i++) {
        let row = []
        for (let j = 0; j < state.width; j++) {
          row.push({
            type: 'floor'
          })
        }
        log.push(row)
      }
      return {
        ...state,
        ModalConfig: false,
        DrawerSetting: true,
        room: log
      }
    },
    onCloseOkModalConfig (state) {
      return {
        ...state,
        ModalConfig: false,
        DrawerSetting: true
      }
    },
    onChangePen (state, event) {
      return {
        ...state,
        pen: event.target.value
      }
    },
    onPaint (state, payload) {
      let T = payload.split('-')
      let {x, y} = {
        x: T[0],
        y: T[1]
      }
      let log = [...state.room]
      if (state.pen === 'seat') {
        if (log[x][y].type === 'floor') log[x][y].type = 'seat'
        else log[x][y].type = 'floor'
      } else if (state.pen === 'lock') {
        if (log[x][y].type === 'seat') log[x][y].type = 'lock'
        else if (log[x][y].type === 'lock') log[x][y].type = 'seat'
      }
      return {
        ...state,
        room: log
      }
    },
    onLogout (state, payload) {
      payload.push('/')
      return {
        ...state
      }
    }
  },
  effects: (dispatch) => ({
    async getListRoom (payload, rootState) {
      let lr = []
      await Client.query({
        query: gql`
          {
            getRooms {
              name code _id
            }
          }
        `
      }).then(function (result) {
        lr = result.data.getRooms
      })
      let log = lr.map(v => {
        return {
          name: v.name,
          code: v.code,
          _id: v._id
        }
      })
      dispatch.Admin.setState('listroom', log)
    },
    async OnComplete (payload, rootState) {
      await Client.mutate({
        variables: {
          code: rootState.Admin.roomcode,
          name: rootState.Admin.roomname,
          width: rootState.Admin.width,
          length: rootState.Admin.length,
          isEnabled: true
        },
        mutation: gql`
          mutation addRoom ($code: String!, $name: String, $width: Int!, $length: Int!, $isEnabled: Boolean!) {
            addRoom (code: $code, name: $name, width: $width, length: $length, isEnabled: $isEnabled) {
              _id code name
            }
          }
        `
      }).then(function (result) {
        let tmp = [...rootState.Admin.listroom]
        tmp.push({
          name: result.data.addRoom.name,
          code: result.data.addRoom.code,
          _id: result.data.addRoom._id
        })
        dispatch.Admin.setState('listroom', tmp)

        let id = result.data.addRoom._id
        let code = result.data.addRoom.code
        let name = result.data.addRoom.name
        for (let i = 0; i < rootState.Admin.length; i++) {
          for (let j = 0; j < rootState.Admin.width; j++) {
            if (rootState.Admin.room[i][j].type !== 'floor') {
              Client.mutate({
                variables: {
                  code: `${code}_${name}_${i}_${j}`,
                  x: i,
                  y: j,
                  state: rootState.Admin.room[i][j].type === 'seat' ? 1 : 2,
                  isEnabled: true,
                  roomId: id
                },
                mutation: gql`
                  mutation addSeat ($code: String!, $x: Int!, $y: Int!, $state: Int, $isEnabled: Boolean!, $roomId: String!) {
                    addSeat (code: $code, x: $x, y: $y, state: $state, isEnabled: $isEnabled, roomId: $roomId) {
                      code _id
                    }
                  }
                `
              })
            }
          }
        }
      })
      dispatch.Admin.onCloseDrawerSetting()
      dispatch.Admin.setState('roomcode', '')
      dispatch.Admin.setState('roomname', '')
      dispatch.Admin.setState('width', 8)
      dispatch.Admin.setState('length', 10)
      dispatch.Admin.initRoom()
    }
  })
}

export const Dhs = {
  state: {
    current: '',
    listroom: [],
    ModalPickSeat: false,
    roomname: '',
    roomid: '',
    date: '',
    room: [],
    width: 0,
    length: 0,
    userId: ''
  },
  reducers: {
    setState (state, key, value) {
      return {
        ...state,
        [key]: value
      }
    },
    setDefaultMenu (state, payload) {
      return {
        ...state,
        current: payload
      }
    },
    handleClickMenu (state, event) {
      return {
        ...state,
        current: event.key
      }
    },
    onLogout (state, payload) {
      const { cookies } = payload
      cookies.remove('DHS')
      cookies.remove('_ID')
      payload.history.push('/')
      return {
        ...state
      }
    },
    onCloseOkModalPickSeat (state, payload) {
      return {
        ...state,
        ModalPickSeat: false
      }
    },
    onCloseCancelModalPickSeat (state, payload) {
      return {
        ...state,
        ModalPickSeat: false
      }
    },
    onOpenModalPickSeat (state, payload) {
      return {
        ...state,
        ModalPickSeat: true
      }
    },
    onLoad (state, payload) {
      if (payload.timestamp !== null) {
        if (payload.room._id === state.roomid && payload.room.name === state.roomname && state.ModalPickSeat) {
          let time = moment(payload.timestamp * 1000).format('DD-MM-YYYY|HH-mm').split('|')
          if (time[0] === state.date) {
            let gg = [...state.room]
            gg[payload.seat.x][payload.seat.y].idschedule = payload._id
            let cc = +time[1].split('-')[0]
            if (cc === 8) {
              gg[payload.seat.x][payload.seat.y].am = true
              gg[payload.seat.x][payload.seat.y].pm = false
              gg[payload.seat.x][payload.seat.y].full = false
            } else if (cc === 13) {
              gg[payload.seat.x][payload.seat.y].pm = true
              gg[payload.seat.x][payload.seat.y].am = false
              gg[payload.seat.x][payload.seat.y].full = false
            } else if (cc === 17) {
              gg[payload.seat.x][payload.seat.y].full = true
              gg[payload.seat.x][payload.seat.y].am = false
              gg[payload.seat.x][payload.seat.y].pm = false
            }
            gg[payload.seat.x][payload.seat.y].userId = payload.userId
            return {
              ...state,
              room: gg
            }
          }
        }
      } else {
        let gg = [...state.room]
        gg[payload.seat.x][payload.seat.y].idschedule = ''
        gg[payload.seat.x][payload.seat.y].am = false
        gg[payload.seat.x][payload.seat.y].pm = false
        gg[payload.seat.x][payload.seat.y].full = false
        gg[payload.seat.x][payload.seat.y].userId = payload.userId
        return {
          ...state,
          room: gg
        }
      }
      return {
        ...state
      }
    }
  },
  effects: (dispatch) => ({
    async getListRoom (payload, rootState) {
      let lr = []
      await Client.query({
        query: gql`
          {
            getRooms {
              name code _id
            }
          }
        `,
        fetchPolicy: 'no-cache'
      }).then(function (result) {
        lr = result.data.getRooms
      })
      let log = lr.map(v => {
        return {
          name: v.name,
          code: v.code,
          _id: v._id
        }
      })
      dispatch.Dhs.setState('listroom', log)
    },
    async onPickSeat (payload, rootState) {
      let ldr = null
      await Client.query({
        query: gql`
          {
            getRooms {
              name code _id width length
              seats {
                _id code x y roomId state
              }
            }
          }
        `,
        fetchPolicy: 'no-cache'
      }).then(function (result) {
        ldr = result.data.getRooms
      })
      let dr = null
      for (let v of ldr) {
        if (v._id === rootState.Dhs.roomid) {
          dr = v
          break
        }
      }
      dispatch.Dhs.setState('width', dr.width)
      dispatch.Dhs.setState('length', dr.length)
      let listseat = dr.seats.map(v => {
        return {
          x: v.x,
          y: v.y,
          state: v.state,
          _id: v._id
        }
      })
      let log = []
      for (let i = 0; i < dr.length; i++) {
        let row = []
        for (let j = 0; j < dr.width; j++) {
          row.push({
            type: 'floor',
            _id: '',
            am: false,
            pm: false,
            full: false,
            idschedule: '',
            userId: ''
          })
        }
        log.push(row)
      }
      for (let v of listseat) {
        log[v.x][v.y].type = v.state === 1 ? 'seat' : 'lock'
        log[v.x][v.y]._id = v._id
      }

      let data = null
      await Client.query({
        query: gql`
          {
            getSchedules {
              _id roomId seatId timestamp
              room {
                name
              }
              user {
                _id username
              }
              seat {
                x y state
              }
            }
          }
        `,
        fetchPolicy: 'no-cache'
      }).then(function (result) {
        data = result.data.getSchedules
      })
      let logx = []
      for (let v of data) {
        if (v.room.name === rootState.Dhs.roomname && v.roomId === rootState.Dhs.roomid) {
          let time = moment(v.timestamp * 1000).format('DD-MM-YYYY|HH-mm').split('|')
          if (rootState.Dhs.date === time[0]) {
            logx.push(v)
          }
        }
      }
      // console.log(logx)
      for (let v of logx) {
        log[v.seat.x][v.seat.y].idschedule = v._id
        let time = moment(v.timestamp * 1000).format('DD-MM-YYYY|HH-mm').split('|')[1].split('-')
        if (+time[0] === 8) {
          log[v.seat.x][v.seat.y].am = true
        } else if (+time[0] === 13) {
          log[v.seat.x][v.seat.y].pm = true
        } else if (+time[0] === 17) {
          log[v.seat.x][v.seat.y].full = true
        }
        log[v.seat.x][v.seat.y].userId = v.user._id
      }
      // console.log(logx)
      dispatch.Dhs.setState('room', log)
    },
    async onPick (payload, rootState) {
      let time = 0
      let date = rootState.Dhs.date.split('-')
      if (payload[3] === 'AM') {
        time = moment().set({
          'date': +date[0],
          'month': +date[1] - 1,
          'year': +date[2],
          'hour': 8,
          'minute': 30
        })
      } else if (payload[3] === 'PM') {
        time = moment().set({
          'date': +date[0],
          'month': +date[1] - 1,
          'year': +date[2],
          'hour': 13,
          'minute': 30
        })
      } else if (payload[3] === 'FULL') {
        time = moment().set({
          'date': +date[0],
          'month': +date[1] - 1,
          'year': +date[2],
          'hour': 17,
          'minute': 30
        })
      }
      let timeunix = time.unix()
      let gg = [...rootState.Dhs.room]
      let {x, y} = {x: +payload[0], y: +payload[1]}
      if (!(gg[x][y].am && gg[x][y].pm && gg[x][y].full)) {
        let _id = null
        await Client.mutate({
          variables: {
            seatId: payload[2],
            userId: rootState.Dhs.userId,
            timestamp: timeunix
          },
          mutation: gql`
            mutation addSchedule ($seatId: String!, $userId: String!, $timestamp: Int!) {
              addSchedule (seatId: $seatId, userId: $userId, timestamp: $timestamp) {
                _id
              }
            }
          `
        }).then(function (result) {
          _id = result.data.addSchedule._id
        })
        gg[x][y].idschedule = _id
        gg[x][y][payload[3].toLowerCase()] = true
        gg[x][y].userId = rootState.Dhs.userId
        dispatch.Dhs.setState('room', gg)
      }
    },
    async onRemovePick (payload, rootState) {
      await Client.mutate({
        variables: {
          _id: payload[3],
          seatId: payload[2]
        },
        mutation: gql`
          mutation ($_id: ID!, $seatId: String!) {
            deleteSchedule (_id: $_id, seatId: $seatId) {
              _id
            }
          }
        `
      })
      let {x, y} = {x: +payload[0], y: +payload[1]}
      let gg = [...rootState.Dhs.room]
      gg[x][y].am = false
      gg[x][y].pm = false
      gg[x][y].full = false
      gg[x][y].idschedule = ''
      dispatch.Dhs.setState('room', gg)
    },
    async OnUpdatePick (payload, rootState) {
      // console.log(payload)
      let time = 0
      let date = rootState.Dhs.date.split('-')
      if (payload[4] === 'AM') {
        time = moment().set({
          'date': +date[0],
          'month': +date[1] - 1,
          'year': +date[2],
          'hour': 8,
          'minute': 30
        })
      } else if (payload[4] === 'PM') {
        time = moment().set({
          'date': +date[0],
          'month': +date[1] - 1,
          'year': +date[2],
          'hour': 13,
          'minute': 30
        })
      } else if (payload[4] === 'FULL') {
        time = moment().set({
          'date': +date[0],
          'month': +date[1] - 1,
          'year': +date[2],
          'hour': 17,
          'minute': 30
        })
      }
      let timeunix = time.unix()
      await Client.mutate({
        variables: {
          _id: payload[3],
          roomId: rootState.Dhs.roomid,
          seatId: payload[2],
          userId: payload[5],
          timestamp: timeunix
        },
        mutation: gql`
          mutation updateSchedule ($_id: ID!, $roomId: String, $seatId: String, $userId: String, $timestamp: Int) {
            updateSchedule (_id: $_id, roomId: $roomId, seatId: $seatId, userId: $userId, timestamp: $timestamp) {
              _id
            }
          }
        `
      })
      let {x, y} = {x: +payload[0], y: +payload[1]}
      let gg = [...rootState.Dhs.room]
      if (payload[4] === 'AM') {
        gg[x][y].am = true
        gg[x][y].pm = false
        gg[x][y].full = false
      } else if (payload[4] === 'PM') {
        gg[x][y].pm = true
        gg[x][y].am = false
        gg[x][y].full = false
      } else if (payload[4] === 'FULL') {
        gg[x][y].full = true
        gg[x][y].am = false
        gg[x][y].pm = false
      }
      dispatch.Dhs.setState('room', gg)
    },
    async onLoading (payload, rootState) {
      await Client.subscribe({
        query: gql`
          subscription Schedule {
            scheduleUpdate {
              _id roomId seatId userId timestamp
              room {
                _id code name
              }
              seat {
                _id code x y state
              }
            }
          }
        `
      }).subscribe({
        next (value) {
          dispatch.Dhs.onLoad(value.data.scheduleUpdate)
        }
      })
    }
  })
}
