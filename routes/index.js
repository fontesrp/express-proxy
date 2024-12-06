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
router.put('/media', (req, res, next) => {
  const { body, headers: reqHeaders, method, query, url: reqUrl } = req

  console.log(new Date().toISOString())
  console.log('method', method)
  console.log('headers', reqHeaders)
  console.log('query', query)
  console.log('reqUrl', reqUrl)
  console.log('body', body)
  console.log('***************')

  const mediaFolder = path.join(os.homedir(), 'Downloads', 'test_media')

  fs.mkdir(mediaFolder, { recursive: true }, mkdirError => {
    if (mkdirError) {
      return console.error('mkdir error', mkdirError)
    }

    const filename = [Date.now(), reqHeaders?.filename].filter(Boolean).join('-')
    const filepath = path.join(mediaFolder, filename)

    fs.writeFile(
      filepath,
      body,
      'binary',
      writeError => writeError && console.error('writeFile error', writeError)
    )
  })

  res.status(203).send('success')
})

router.get('/redirect', (req, res, next) => {
  res.redirect(
    'https://app.emocha.com/sign-up?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50SWQiOiIxMjM0NTY3ODkwIiwiZmlyc3ROYW1lIjoiUm9zZW1hcnkiLCJpYXQiOjE1MTYyMzkwMjJ9.XIagQEpcXZnqjPM_QyVfjS93POU9mfHyapXC9hiHDFk'
  )
})

router.get('/manifest.json', (req, res, next) => {
  res.sendFile(path.join('/Users/rfontes/Downloads', 'manifest.json'))
})

router.get('/img.png', (req, res, next) => {
  res.sendFile(path.join('/Users/rfontes/Downloads', 'img.png'))
})

router.all('/*', (req, res, next) => {
  const { body, headers: reqHeaders, method, query, url: reqUrl } = req

  res.sendFile(path.join('/Users/rfontes/Downloads', 'fingerprint.html'))

  /*const url = reqUrl.replace(/\?.*, '')

  if (!url) {
    next()
    return
  }

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
    })*/
})

module.exports = router
