// Run with: URL=https://my.proxied.url.com yarn start

const express = require('express')
const cookieParser = require('cookie-parser')
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
app.use(express.json({ limit: '50MB' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// for parsing multipart/form-data
app.use(upload.array())

app.use('/', indexRouter)

app.use((req, res) => res.status(404).send({ pageName: 'not-found' }))

app.use((err, req, res, next) =>
  res.status(500).send({ error: err?.message, logref: 'internal-server-error' })
)

module.exports = app
