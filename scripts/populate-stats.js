const cheerio = require('cheerio')
const got = require('got')
const fs = require('fs')
const path = require('node:path')

const server = 'https://beybladeplanner.com/'

async function loadPage(resource, id) {
  const response = await got({ url: `${server}${resource}`, searchParams: { id } })
  if (response.statusCode === 200) {
    return cheerio.load(response.rawBody)
  }
  throw new Error(`Error: Failed to retrieve webpage. Status code: ${response.status}`)
}

async function getPartList() {
  const PAGE_REGEX = /(?<part>\w+)\.php\?id=(?<id>\d+)/
  const $ = await loadPage('parts.php')
  const linksEl = [...$('a')]
  const links = linksEl
    .map((link) => $(link).attr('href'))
    .filter((link) => PAGE_REGEX.test(link))
    .reduce((groups, link) => {
      const data = PAGE_REGEX.exec(link)
      if (groups[data.groups.part]) {
        groups[data.groups.part].push(data.groups.id)
        return {
          ...groups,
          [data.groups.part]: [...groups[data.groups.part], data.groups.id],
        }
      }
      return {
        ...groups,
        [data.groups.part]: [data.groups.id],
      }
    }, {})
  return links
}

const labelFieldMap = {
  Attack: 'attack',
  Defense: 'defense',
  Stamina: 'stamina',
  Endurance: 'endurance',
  Dash: 'dash',
  'Burst Resistance': 'burst_resistance',
  Weight: 'weight',
  Height: 'height',
  Width: 'width',
}

//// parse html

function parseName($, heroComponent) {
  const statsEl = heroComponent.find('.card-title.ml-2')
  const imgEl = heroComponent.find('img.self-start')
  return {
    name: statsEl.text().trim(),
    image: `${server}${$(imgEl).attr('src')}`,
  }
}

function parseComponentType($, heroComponent) {
  const statsEl = heroComponent.find('.btn.bg-base-100')
  const type = $(statsEl[0]).find('.badge').text().trim()
  const spin = $(statsEl[1]).find('img').attr('src')
  return {
    type,
    spin: /img\/ui\/(\w+)\.png/.exec(spin)?.[1] ?? 'unknown',
  }
}

function parseBaseStats($, heroComponent) {
  const partStats = {}
  const statsEl = [...heroComponent.find('.label-text')]
  statsEl.forEach((stats) => {
    const data = /(?<stats>[\w\s]+) \((?<value>\d+)\)/.exec($(stats).text())
    if (data) {
      partStats[labelFieldMap[data.groups.stats]] = Number(data.groups.value)
    }
  })
  return partStats
}

function parseMeasurement($, heroComponent) {
  const partStats = {}
  const statsEl = [...heroComponent.find('.stat')]
  statsEl.forEach((el) => {
    const stats = $(el).find('.stat-title').text().trim()
    const rawValue = $(el).find('.stat-value').text().trim()
    const value = /^([\d.]+)/.exec(rawValue)[1]
    partStats[labelFieldMap[stats]] = Number(value)
  })
  return partStats
}

async function parseParts(parts, ids, fn) {
  const promises = ids.map(async (id) => {
    const $ = await loadPage(`${parts}.php`, id)
    const heroComponent = $('.hero')
    return fn(id, $, heroComponent)
  })
  return await Promise.all(promises)
}

// type, spin
// attack, defense, stamina,
// weight, height, width

async function parseBlade(id, $, heroComponent) {
  return {
    id,
    ...parseName($, heroComponent),
    ...parseBaseStats($, heroComponent),
    ...parseComponentType($, heroComponent),
    ...parseMeasurement($, heroComponent),
  }
}

// type, spin
// attack, defense, endurance
// weight, height, width
function parseRatchet(_ids) {}

// type, spin
// attack, defense, endurance, dash, burst resistance
// weight, height, width
function parseBit(_ids) {}

async function populateStats() {
  const parts = await getPartList()
  const stats = {}
  const promises = Object.entries(parts).map(async ([part, _ids]) => {
    const ids = Array.from(new Set(_ids))
    console.log(`loading ${part}: ${ids.join(', ')}`)

    stats[part] = (await parseParts(part, ids, parseBlade)).filter((x) => x.name)
  })
  await Promise.all(promises)

  fs.writeFileSync(
    path.resolve(process.cwd(), 'data', 'stats.json'),
    JSON.stringify(stats, null, 2),
  )
  return stats
}

module.exports = populateStats
