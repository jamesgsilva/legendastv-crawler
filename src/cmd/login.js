#!/usr/bin/env node

'use strict'

const { program } = require('commander')
const boxen = require('boxen')
const ora = require('ora')
const http = require('../lib/http')
const legends = require('../lib/legends')(http)
const parser = require('../lib/parser')

async function main (username, password) {
  const spinner = ora('Authenticating...').start()
  const response = await legends.login(username, password)
  const user = parser.login(response)
  if (user === username) {
    console.log(boxen('logged', { padding: 1, backgroundColor: 'green' }))
  } else {
    console.log(boxen('No logged', { padding: 1, backgroundColor: 'red' }))
  }
  spinner.stop()
}

const { LEGENDAS_USERNAME, LEGENDAS_PASSWORD } = process.env

program
  .option('-u, --username <username>', 'user username', LEGENDAS_USERNAME)
  .option('-p, --password <password>', 'user password', LEGENDAS_PASSWORD)

program.parse(process.argv)

main(program.username, program.password)
