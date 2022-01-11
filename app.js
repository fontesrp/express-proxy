// Run with: URL=https://my.proxied.url.com yarn start

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')
const multer = require('multer')

require('./config')
const indexRouter = require('./routes/index')

const upload = multer()
const app = express()

// need to add in case of self-signed certificate connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

app.disable('etag')

app.use(logger('dev'))
app.use(bodyParser.raw({ limit: '500MB' }))
app.use(express.json({ limit: '500MB' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// for parsing multipart/form-data
app.use(upload.array())

app.use('/', indexRouter)

// eslint-disable-next-line no-unused-vars
app.use((req, res) => res.status(404).send({ pageName: 'not-found' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) =>
  res.status(500).send({ error: err?.message, logref: 'internal-server-error' })
)

module.exports = app
