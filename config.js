const axios = require('axios')
const debug = require('debug')
const os = require('os')
const qs = require('qs')

const log = debug('express-proxy:server')
const warn = debug('express-proxy:warning')

const networkInterfaces = os.networkInterfaces()
const ip = networkInterfaces?.en0?.find?.(networkInterface => networkInterface?.family === 'IPv4')

if (ip) {
  log('Your current IP is:', ip.address)
} else {
  warn('Could not get local IP address for the server')
}

axios.defaults.baseURL = process.env.URL
axios.defaults.headers.common.Accept = 'application/json'
axios.defaults.paramsSerializer = params =>
  qs.stringify(params, { arrayFormat: 'comma', encode: false })
axios.defaults.timeout = 30000
