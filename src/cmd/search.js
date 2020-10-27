#!/usr/bin/env node

'use strict'

const { program } = require('commander')
const boxen = require('boxen')
const ora = require('ora')
const similarity = require('string-similarity')
const http = require('../lib/http')
const legends = require('../lib/legends')(http)
const parser = require('../lib/parser')
const debug = require('debug')

const LEGENDAS_SIMILARITY = parseFloat(process.env.LEGENDAS_SIMILARITY) || 0.2
const log = debug('app-search')

async function main(term, page = 0) {
  let total = 0
  while (true) {
    const spinner = ora(`Searching for ${term} on page ${page}...`).start()
    const response = await legends.search(term, page)
    const result = parser.search(response)
    const similar = result.legends.filter(l => {
      const similar = similarity.compareTwoStrings(term.toLowerCase(), l.name.replace('.', ' ').toLowerCase())
      const isSimilar = similar > LEGENDAS_SIMILARITY
      if (!isSimilar) {
        log('Legend %o is not similar %o', l.name, similar)
      }
      return isSimilar
    })
    await Promise.all(similar.map(async l => {
      const response = await legends.likes(l.id)
      l.likes = parser.likes(response)
    }))
    total += similar.length
    if (!result.more) {
      spinner.stop()
      break
    }
    page++
    spinner.stop()
  }
  console.log(boxen(`Foram encontradas ${total} legendas`, { padding: 1, backgroundColor: 'green' }))
}

program
  .option('-t, --term <term>', 'Search term', 'Waiting for the Barbarians')

program.parse(process.argv)

main(program.term)
