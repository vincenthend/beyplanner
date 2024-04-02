const cheerio = require('cheerio')
const got = require('got')
const fs = require('fs')
const path = require('node:path')

// Const

const server = 'https://beyblade.wiki'

// Loader
async function loadPage(resource) {
  const response = await got({ url: resource })
  if (response.statusCode === 200) {
    return cheerio.load(response.rawBody)
  }
  throw new Error(`Error: Failed to retrieve webpage. Status code: ${response.status}`)
}

// Get parts

function parseBitList($, rows) {
  return rows.map((row) => {
    const data = [...$(row).find('td')]
    return {
      set_id: $(data[0]).text(),
      set_url: $(data[0]).find('a').attr('href'),
      code: $(data[1]).text(),
      name: $(data[2]).text(),
      url: $(data[2]).find('a').attr('href'),
    }
  })
}

function parseBladeList($, rows) {
  return rows.map((row) => {
    const data = [...$(row).find('td')]
    return {
      set_id: $(data[0]).text(),
      set_url: $(data[0]).find('a').attr('href'),
      name: $(data[1]).text(),
      url: $(data[1]).find('a').attr('href'),
    }
  })
}

function parseRatchetList($, rows) {
  return rows.map((row) => {
    const data = [...$(row).find('td')]
    return {
      set_id: $(data[0]).text(),
      set_url: $(data[0]).find('a').attr('href'),
      code: $(data[1]).text(),
      name: $(data[2]).text(),
      url: $(data[1]).find('a').attr('href'),
    }
  })
}

async function getPartList() {
  const parts = {
    bit: parseBitList,
    blade: parseBladeList,
    ratchet: parseRatchetList,
  }

  const data = {}
  console.log('Loading wiki data')
  const promise = Object.entries(parts).map(async ([part, fn]) => {
    const $ = await loadPage(`${server}/list-of-beyblade-x-${part}`)
    const tableRows = [...$('.wp-block-table tbody').find('tr')]
    data[part] = fn($, tableRows)
  })

  await Promise.all(promise)

  return data
}

async function populateWikiParts() {
  const parts = await getPartList()
  const partsFile = path.resolve(process.cwd(), 'data', 'parts-wiki.json')
  fs.writeFileSync(partsFile, JSON.stringify(parts, null, 2))
  return parts
}

module.exports = populateWikiParts
