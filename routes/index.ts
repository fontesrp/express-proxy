import axios from 'axios'
import express, { type NextFunction, type Request, type Response } from 'express'
import FormData from 'form-data'
import fs from 'fs'
import os from 'os'
import path from 'path'

const getLength = (formData: FormData): Promise<number | undefined> =>
  new Promise((resolve, reject) =>
    formData.getLength((err, length) => (err ? reject(err) : resolve(length)))
  )

const router = express.Router()

router.post('/video', (req: Request, res: Response, _next: NextFunction) => {
  const { body, headers: reqHeaders, method, query, url: reqUrl } = req

  console.log('method', method)
  console.log('headers', reqHeaders)
  console.log('query', query)
  console.log('reqUrl', reqUrl)
  console.log('body', body)
  console.log('***************')

  const videosfolder = path.join(os.homedir(), 'Downloads', 'test_video')

  fs.mkdir(videosfolder, { recursive: true }, mkdirError => {
    if (mkdirError) {
      return console.error('mkdir error', mkdirError)
    }

    fs.readdir(videosfolder, { withFileTypes: true }, (readdirError, files) => {
      if (readdirError) {
        return console.error('readdir error', readdirError)
      }

      const latestPart = files.reduce((max, file) => {
        const part = file.name.replace(/.*(\d)\.part$/, '$1')
        return Math.max(max, Number(part) || 0)
      }, 0)

      const partNumber = query?.part || latestPart + 1
      const filepath = path.join(videosfolder, `movie_${partNumber}.part`)

      fs.writeFile(
        filepath,
        body,
        'binary',
        writeError => writeError && console.error('writeFile error', writeError)
      )
    })
  })

  res.status(203).send('success')
})

router.all('/*splat', (req: Request, res: Response, _next: NextFunction) => {
  const { body, headers: reqHeaders, method, query, url: reqUrl } = req

  const url = reqUrl.replace(/\?.*/, '')

  const headers: Record<string, string | string[] | undefined> = { ...(reqHeaders || {}) }

  delete headers.host
  delete headers['user-agent']

  let data: unknown = body
  let getContentLength: Promise<string | string[] | undefined | null> = Promise.resolve(
    headers['content-length']
  )

  if (headers['content-type']?.toString().startsWith('multipart/form-data')) {
    delete headers['content-length']

    data = Object.entries((body as Record<string, unknown>) || {}).reduce((form, [key, value]) => {
      form.append(key, value as string | Buffer)
      return form
    }, new FormData())

    Object.assign(headers, (data as FormData).getHeaders())

    getContentLength = getLength(data as FormData).then(length =>
      length === undefined ? null : String(length)
    )
  }

  let resData: unknown
  let resHeaders: Record<string, string | number | string[] | undefined> = {}
  let resStatus = 203

  getContentLength
    .then(contentLength => {
      if (contentLength) {
        headers['content-length'] = contentLength
      }

      const props = { data, headers, method, params: method === 'get' ? data : query, url }

      console.log(props)

      return axios(props)
    })
    .then(response => {
      resData = response.data || {}
      resHeaders = { ...response.headers } as Record<string, string | number | string[] | undefined>
      resStatus = response.status || 203
    })
    .catch(
      (error: {
        response?: {
          data?: unknown
          headers?: Record<string, string | number | string[] | undefined>
          status?: number
        }
      }) => {
        const { response } = error || {}
        resData = response?.data || { logref: 'All is fucked!' }
        resHeaders = response?.headers || {}
        resStatus = response?.status || 500
      }
    )
    .finally(() => {
      delete resHeaders['transfer-encoding']
      res.set(resHeaders)
      res.status(resStatus).send(resData)
    })
})

export default router
