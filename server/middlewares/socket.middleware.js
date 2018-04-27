import io from 'socket.io'
import { isDevMode } from '../server'

const socketIo = (app) => {
  const host = process.env.HOST_NAME.replace(/:\d+/, '')
  const port = isDevMode ? `:${process.env.PORT}` : ':*'
  const sio = io(app, {
    origins: `${host}${port}`,
    wsEngine: 'ws',
    transports: ['websocket', 'polling']
  })

  // middleware
  sio.on('connection', (socket) => {

  })
}

export default socketIo
