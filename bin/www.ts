#!/usr/bin/env node

import debug from 'debug'
import http from 'http'

import app from '../app.ts'

const debugLog = debug('express-proxy:server')

const normalizePort = (val: string): number | string | false => {
  const portNum = parseInt(val, 10)

  if (isNaN(portNum)) {
    return val
  }

  if (portNum >= 0) {
    return portNum
  }

  return false
}

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const server = http.createServer(app)

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  switch (error.code) {
    case 'EACCES':
      console.error(bind, 'requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind, 'is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = (): void => {
  const addr = server.address()
  if (!addr) {
    return
  }

  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debugLog('Listening on', bind)
}

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
