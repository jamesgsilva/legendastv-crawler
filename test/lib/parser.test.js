'use strict'

const parser = require('../../src/lib/parser')
const fs = require('fs')
const path = require('path')

const { LEGENDAS_URL } = process.env

describe('search', () => {
  test('Quando a busca tiver paginação, então deve retornar mais', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/search/search-with-pagination.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const legends = [{
      id: 'e41fc91a2d464d4a610eba0ab8b4a5ed',
      name: 'Simpsons s17e14',
      user: 'cameratus',
      language: 'Português-BR',
      date: '2006-11-02',
      note: 10,
      downloads: 391,
      link: `${LEGENDAS_URL}/downloadarquivo/e41fc91a2d464d4a610eba0ab8b4a5ed`,
      likes: 0.0

    }]
    const result = parser.search(html)
    expect(result.legends).toEqual(expect.arrayContaining(legends))
    expect(result.more).toBe(true)
  })

  test('Quando a busca não tiver paginação, então não deve retornar mais', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/search/search-without-pagination.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const result = parser.search(html)
    expect(result.legends).toHaveLength(15)
    expect(result.more).toBe(false)
  })
})

describe('login', () => {
  test('Quando não logado, então não deve retornar username', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/login/without-username.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const username = parser.login(html)
    expect(username).toBe('')
  })

  test('Quando logado, então deve retornar username', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/login/with-username.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const username = parser.login(html)
    expect(username).toBe('jamesgsilva')
  })
})

describe('likes', () => {
  test('a', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/download/without-likes-without-dislikes.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const likes = parser.likes(html)
    expect(likes).toBe(0)
  })

  test('b', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/download/likes-without-dislikes.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const likes = parser.likes(html)
    expect(likes).toBe(10)
  })

  test('b', () => {
    const html = fs.readFileSync(path.join(__dirname, '../mocks/download/likes-with-dislikes.html'), {
      encoding: 'utf8',
      flag: 'r'
    })
    const likes = parser.likes(html)
    expect(likes).toBe(5.00)
  })
})
