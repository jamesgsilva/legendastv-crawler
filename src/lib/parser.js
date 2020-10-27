'use strict'

const cheerio = require('cheerio')

const { LEGENDAS_URL } = process.env

module.exports = {
  /**
   * @typedef {Object} Legend
   * @property {string} id
   * @property {string} name
   * @property {string} user
   * @property {string} language
   * @property {string} date
   * @property {number} note
   * @property {number} downloads
   * @property {string} link
   * @property {number} likes
   *
   * @typedef {Object} Result
   * @property {Legend[]} legends
   * @property {boolean} more
   *
   * @param {string} html
   * @return {Result} result
   */
  search: (html) => {
    const $search = cheerio.load(html)
    const result = {
      more: $search('.load_more').length > 0,
      legends: []
    }
    const dataRegex = new RegExp('(\\d+)\\sdownloads?\\,\\snota\\s(\\d+)')
    const dateRegex = new RegExp('(\\d{2}\/\\d{2}\/\\d{4})')
    $search('.f_left').each((i, elem) => {
      const $a = elem.firstChild.firstChild
      const id = $a.attribs.href.split('/')[2]
      const name = $a.firstChild.data.trim()
      const $p = elem.lastChild
      const [, downloads, note] = dataRegex.exec($p.firstChild.data.trim())
      const [, date] = dateRegex.exec($p.lastChild.data.trim())
      const user = $p.children[1].firstChild.data.trim()
      const $img = elem.next
      const language = $img.attribs.title
      result.legends.push({
        id,
        name,
        user,
        language,
        date: date.split('/').reverse().join('-'),
        note: parseInt(note),
        downloads: parseInt(downloads),
        link: `${LEGENDAS_URL}/downloadarquivo/${id}`,
        likes: 0
      })
    })
    return result
  },

  /**
   * @param {string} html
   * @return {string} username from user logged
   */
  login: (html) => {
    const $home = cheerio.load(html)
    return $home('.login').find('a[href="/meuperfil"]').contents().text()
  },

  /**
   * @param {string} html
   * @return {number} The like ratio
   */
  likes: (html) => {
    const $download = cheerio.load(html)
    let likes = 0
    const handup = $download('.icon_handup').get(0).parent.next
    if (handup) {
      likes = parseInt(handup.data)
    }
    let dislikes = 0
    const handlow = $download('.icon_handlow').get(0).parent.next
    if (handlow) {
      dislikes = parseInt(handlow.data)
    }
    if (dislikes === 0) {
      return likes
    }
    return parseFloat(parseFloat(likes / dislikes).toFixed(2))
  }
}
