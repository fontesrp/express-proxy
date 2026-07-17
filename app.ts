// Run with: URL=https://my.proxied.url.com yarn start

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import multer from 'multer'

import './config.ts'
import indexRouter from './routes/index.ts'

const upload = multer()
const app = express()

// need to add in case of self-signed certificate connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

app.disable('etag')

app.use(logger('dev'))
app.use(bodyParser.raw({ limit: '500MB' }))
app.use(express.json({ limit: '500MB' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// for parsing multipart/form-data
app.use(upload.any())

app.use('/', indexRouter)

app.use((_req, res) => res.status(404).send({ pageName: 'not-found' }))

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) =>
  res.status(500).send({ error: err?.message, logref: 'internal-server-error' })
)

export default app
