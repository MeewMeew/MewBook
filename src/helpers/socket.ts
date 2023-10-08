import { io } from "socket.io-client";

import { apiURL } from "@/shared/config";

import { Logger } from "./logger";

export const mewSocket = io(`${apiURL}/mewbook`, { transports: ['polling'] })

mewSocket.on('connect', () => {
  Logger.log('Socket', 'Connected to socket server')
})