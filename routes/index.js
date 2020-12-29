const axios = require('axios')
const express = require('express')
const FormData = require('form-data')

const getLength = formData =>
  new Promise((resolve, reject) =>
    formData.getLength((err, length) => (err ? reject(err) : resolve(length)))
  )

const router = express.Router()

router.all('/*', (req, res, next) => {
  const { body, headers: reqHeaders, method, query, url } = req

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

      const props = { data, headers, method, params: query, url }

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
      resData = response?.data || 'All is fucked!'
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
