import { io } from 'socket.io-client'

import { apiURL } from '@/shared/config'
import { type MewBookClient } from '@/types/socket'

import { Logger } from './logger'

export const mewSocket: MewBookClient = io(`${apiURL}/mewbook`)

mewSocket.on('connect', () => {
  Logger.log('Socket', 'Connected to socket server')
})
