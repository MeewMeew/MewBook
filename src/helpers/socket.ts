import { io } from 'socket.io-client'

import { Logger } from '@/helpers/logger'
import { apiURL } from '@/shared/config'
import { AppNameLowerCased } from '@/shared/constants'
import { type MewBookClient } from '@/types/socket'

export const mewSocket: MewBookClient = io(`${apiURL}/${AppNameLowerCased}`)

mewSocket.on('connect', () => {
  Logger.log('Socket', 'Connected to socket server')
})
