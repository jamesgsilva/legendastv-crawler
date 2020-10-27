'use strict'

const { program } = require('commander')

program
  .version('1.0.0')
  .command('search', 'search legends', {
    executableFile: 'src/cmd/search.js',
    isDefault: true
  })
  .command('login', 'log in', {
    executableFile: 'src/cmd/login.js'
  })

program.parse(process.argv)
