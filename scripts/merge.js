const fs = require('fs')
const path = require('node:path')
const populateStats = require('./populate-stats')
const populateWikiParts = require('./populate-wiki')

const PARTS = ['bit', 'ratchet', 'blade']

function merge(statsParts, wikiParts) {
  const data = {}
  PARTS.map((part) => {
    data[part] = []
    for (const statsPart of statsParts[part]) {
      // find b
      const wiki = wikiParts[part].find(
        (x) => x.name === statsPart.name || x.code === statsPart.name,
      )
      data[part].push({
        ...statsPart,
        wiki,
      })
    }
  })

  fs.writeFileSync(
    path.resolve(process.cwd(), 'data', 'stats-complete.json'),
    JSON.stringify(data, null, 2),
  )
}

async function main() {
  const [statsParts, wikiParts] = await Promise.all([populateStats(), populateWikiParts()])
  merge(statsParts, wikiParts)
}

main()
