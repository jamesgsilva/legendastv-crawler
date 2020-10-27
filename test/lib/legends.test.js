'use strict'

const legendsFactory = require('../../src/lib/legends')

describe('search', () => {
  test('Quando a busca não for respondida, então deve levantar uma exceção', async () => {
    const term = 'Harry potter'
    const page = 0
    const legends = legendsFactory({
      get: () => Promise.reject(new Error('HTTP error'))
    })
    await expect(legends.search(term, page)).rejects.toThrow()
  })

  test('Quando a busca for respondida, então deve retornar o corpo da pagina', async () => {
    const term = 'Harry potter'
    const page = 0
    const response = { body: '<html></html>' }
    const http = {
      get: () => Promise.resolve(response)
    }
    const getSpy = jest.spyOn(http, 'get')
    const legends = legendsFactory(http)
    const html = await legends.search(term, page)
    expect(getSpy).toHaveBeenCalledWith(`legenda/busca/${term}/1/-/${page}/-`)
    expect(html).toBe(response.body)
  })
})

describe('likes', () => {
  test('Quando curtidas não for respondida, então deve levantar uma exceção', async () => {
    const id = Math.floor((Math.random() * 10) + 1)
    const legends = legendsFactory({
      get: () => Promise.reject(new Error('HTTP error'))
    })
    await expect(legends.likes(id)).rejects.toThrow()
  })

  test('Quando curtidas for respondida, então deve retornar o corpo da pagina', async () => {
    const response = { body: '<html></html>' }
    const http = {
      get: () => Promise.resolve(response)
    }
    const getSpy = jest.spyOn(http, 'get')
    const legends = legendsFactory(http)
    const id = Math.floor((Math.random() * 10) + 1)
    const html = await legends.likes(id)
    expect(getSpy).toHaveBeenCalledWith(`download/${id}`)
    expect(html).toBe(response.body)
  })
})

describe('login', () => {
  test('Quando o envio dos formulario não for respondido, então deve levantar uma exceção', async () => {
    const username = Math.random().toString(36).substring(7)
    const password = Math.random().toString(36).substring(7)
    const legends = legendsFactory({
      post: () => Promise.reject(new Error('HTTP error'))
    })
    await expect(legends.login(username, password)).rejects.toThrow()
  })

  test('Quando a pagina inicial nao for respondida, então deve levantar uma exceção', async () => {
    const username = Math.random().toString(36).substring(7)
    const password = Math.random().toString(36).substring(7)
    const legends = legendsFactory({
      post: () => Promise.resolve(''),
      get: () => Promise.reject(new Error('HTTP error'))
    })
    await expect(legends.login(username, password)).rejects.toThrow()
  })

  test('Quando o envio do formulario for respondido, e a pagina inicial for respondidos, então deve retornar o corpo da pagina', async () => {
    const response = { body: '<html></html>' }
    const http = {
      post: () => Promise.resolve(''),
      get: () => Promise.resolve(response)
    }
    const legends = legendsFactory(http)
    const postSpy = jest.spyOn(http, 'post')
    const getSpy = jest.spyOn(http, 'get')
    const username = Math.random().toString(36).substring(7)
    const password = Math.random().toString(36).substring(7)
    const html = await legends.login(username, password)
    expect(postSpy).toHaveBeenCalledWith('login', {
      form: {
        _method: 'POST',
        'data[User][username]': username,
        'data[User][password]': password
      }
    })
    expect(getSpy).toHaveBeenCalledWith('')
    expect(html).toBe(response.body)
  })
})
