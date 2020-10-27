'use strict'

const got = require('got')
const { CookieJar } = require('tough-cookie')
const HttpAgent = require('agentkeepalive')
const { HttpsAgent } = HttpAgent
const url = require('url')
const UserAgent = require('user-agents')
const debug = require('debug')

const { LEGENDAS_URL } = process.env
const log = debug('app-http')

module.exports = got.extend({
  cookieJar: new CookieJar(),
  prefixUrl: LEGENDAS_URL,
  timeout: 5000,
  headers: {
    Origin: LEGENDAS_URL,
    Host: new url.URL(LEGENDAS_URL).host,
    'user-agent': new UserAgent().toString()
  },
  agent: {
    http: new HttpAgent(),
    https: new HttpsAgent()
  },
  followRedirect: false,
  hooks: {
    afterResponse: [
      (response) => {
        log(response.req.method + ' ' + response.url + ' ' + response.statusCode)
        return response
      }
    ]
  }
})
