// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'node:path'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = fs.readFileSync(path.resolve(process.cwd(), 'data', 'stats-complete.json'))
  res.status(200).setHeader('content-type', 'application/json').send(result)
}
