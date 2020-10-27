'use strict'

module.exports = (client) => {
  return {
    search: async (term, page = 0) => {
      const { body: html } = await client.get(`legenda/busca/${term}/1/-/${page}/-`)
      return html
    },

    likes: async (id) => {
      const { body: html } = await client.get(`download/${id}`)
      return html
    },

    login: async (username, password) => {
      await client.post('login', {
        form: {
          _method: 'POST',
          'data[User][username]': username,
          'data[User][password]': password
        }
      })
      const { body: html } = await client.get('')
      return html
    }
  }
}
