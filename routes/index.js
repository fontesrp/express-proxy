const axios = require('axios')
const express = require('express')
const FormData = require('form-data')
const fs = require('fs')
const os = require('os')
const path = require('path')

const getLength = formData =>
  new Promise((resolve, reject) =>
    formData.getLength((err, length) => (err ? reject(err) : resolve(length)))
  )

// eslint-disable-next-line new-cap
const router = express.Router()

// eslint-disable-next-line no-unused-vars
router.post('/video', (req, res, next) => {
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

// eslint-disable-next-line no-unused-vars
router.all('/*', (req, res, next) => {
  const { body, headers: reqHeaders, method, query, url: reqUrl } = req

  const url = reqUrl.replace(/\?.*/, '')

  const headers = { ...(reqHeaders || {}) }

  delete headers.host
  delete headers['user-agent']

  let data = body
  let getContentLength = Promise.resolve(headers['content-length'])

  if (headers['content-type']?.startsWith?.('multipart/form-data')) {
    delete headers['content-length']

    data = Object.entries(body || {}).reduce((form, [key, value]) => {
      form.append(key, value)
      return form
    }, new FormData())

    Object.assign(headers, data.getHeaders())

    getContentLength = getLength(data).catch(() => null)
  }

  let resData
  let resHeaders
  let resStatus

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
      resHeaders = response.headers || {}
      resStatus = response.status || 203
    })
    .catch(error => {
      const { response } = error || {}
      resData = response?.data || { logref: 'All is fucked!' }
      resHeaders = response?.headers || {}
      resStatus = response?.status || 500
    })
    .finally(() => {
      delete resHeaders['transfer-encoding']
      res.set(resHeaders)
      res.status(resStatus).send(resData)
    })
})

module.exports = router
