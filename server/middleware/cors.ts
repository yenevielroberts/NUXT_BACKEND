
import { defineEventHandler } from 'h3'
import type { IncomingMessage, ServerResponse } from 'http'

export default defineEventHandler(async (event) => {
  const req = event.node.req as IncomingMessage & { headers: Record<string, string | undefined> }
  const res = event.node.res as ServerResponse
  const origin = req.headers.origin || ''

  const allowed = (process.env.CORS_ORIGIN || 'http://localhost:8080').split(',').map(o => o.trim())
  const devAllowAll = process.env.NODE_ENV === 'development' || process.env.ALLOW_ALL_CORS === 'true'

  const allowOrigin = (() => {
    if (!origin) return undefined
    if (devAllowAll) return origin
    if (allowed.length === 0) return origin
    if (allowed.includes('*')) return origin
    if (allowed.includes(origin)) return origin
    return undefined
  })()

  if (!allowOrigin) {
    // Origin not allowed — reject preflight or request
    if (req.method === 'OPTIONS') {
      res.statusCode = 403
      res.end('CORS origin not allowed')
      return
    }
    return
  }

  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
  }
})
