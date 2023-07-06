import { io } from 'socket.io-client'

const URL = process.env.REACT_APP_NODE_ENV === 'production' ? undefined : 'http://localhost:4000'

export const socket = io(URL)