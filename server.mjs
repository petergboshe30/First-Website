import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const PORT = Number(process.env.PORT || 10000)
const HOST = '0.0.0.0'
const DIST = resolve('dist')
const DATA_FILE = process.env.DATA_FILE || '/tmp/serviceconnect-demo.json'
const PRIVATE_FILES_DIR = process.env.PRIVATE_FILES_DIR || '/tmp/serviceconnect-private-files'
const SESSION_COOKIE = 'sc_demo_session'
const MAX_BODY = 8 * 1024 * 1024
const sessions = new Map()
const rate = new Map()
let writes = Promise.resolve()

const emptyStore = () => ({ users: [], requests: [], providerInterests: [] })
async function readStore() {
  try { return JSON.parse(await readFile(DATA_FILE, 'utf8')) } catch { return emptyStore() }
}
async function saveStore(store) {
  writes = writes.then(async () => {
    const temp = DATA_FILE + '.tmp'
    await writeFile(temp, JSON.stringify(store), { mode: 0o600 })
    await rename(temp, DATA_FILE)
  })
  return writes
}
function json(res, status, value, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers })
  res.end(JSON.stringify(value))
}
function cookie(res, value, maxAge = 60 * 60 * 24 * 7) {
  const secure = process.env.NODE_ENV === 'production' || process.env.RENDER
  res.setHeader('set-cookie', `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`)
}
function sessionUser(req) {
  const raw = req.headers.cookie || ''
  const match = raw.match(new RegExp('(?:^|;\\s*)' + SESSION_COOKIE + '=([^;]+)'))
  if (!match) return null
  const record = sessions.get(match[1])
  if (!record || record.expires < Date.now()) { sessions.delete(match[1]); return null }
  return record.userId
}
async function body(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > MAX_BODY) throw Object.assign(new Error('Request is too large.'), { status: 413 })
  }
  try { return JSON.parse(raw || '{}') } catch { throw Object.assign(new Error('Please send valid form data.'), { status: 400 }) }
}
function limited(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown'
  const key = ip + ':' + Math.floor(Date.now() / 60000)
  const count = (rate.get(key) || 0) + 1
  rate.set(key, count)
  if (rate.size > 10000) rate.clear()
  return count > 40
}
function clean(value, max = 500) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email } }
function uploadBuffer(input, allowed, maxBytes) {
  const data = typeof input?.data === 'string' ? input.data : ''
  const type = clean(input?.type, 80).toLowerCase()
  if (!allowed.includes(type) || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data))
    throw Object.assign(new Error('Choose a supported image or PDF file.'), { status: 400 })
  const bytes = Buffer.from(data, 'base64')
  if (!bytes.length || bytes.length > maxBytes) throw Object.assign(new Error(`File must be smaller than ${Math.floor(maxBytes / 1024 / 1024)} MB.`), { status: 413 })
  const valid = type === 'image/png' ? bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a'
    : type === 'image/jpeg' ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : type === 'image/webp' ? bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'
    : type === 'application/pdf' ? bytes.subarray(0, 5).toString() === '%PDF-'
    : false
  if (!valid) throw Object.assign(new Error('The file contents do not match the selected file type.'), { status: 400 })
  return { bytes, type }
}
async function storePrivateFile(id, bytes) {
  await mkdir(PRIVATE_FILES_DIR, { recursive: true, mode: 0o700 })
  await writeFile(resolve(PRIVATE_FILES_DIR, id), bytes, { flag: 'wx', mode: 0o600 })
}
function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(password, salt, 64).toString('hex') }
}
function issueSession(res, user) {
  const token = randomBytes(32).toString('base64url')
  sessions.set(token, { userId: user.id, expires: Date.now() + 7 * 86400000 })
  cookie(res, token)
}
function mime(path) {
  return ({ '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2' })[extname(path)] || 'application/octet-stream'
}
async function serveStatic(req, res) {
  const url = new URL(req.url, 'http://localhost')
  let pathname = decodeURIComponent(url.pathname)
  pathname = pathname.replace(/^\/First-Website(?=\/|$)/, '') || '/'
  let file = pathname === '/' ? resolve(DIST, 'index.html') : resolve(DIST, '.' + pathname)
  if (!file.startsWith(DIST + sep) && file !== resolve(DIST, 'index.html')) return json(res, 400, { error: 'Invalid path.' })
  try {
    const bytes = await readFile(file)
    res.writeHead(200, { 'content-type': mime(file), 'cache-control': file.includes(sep + 'assets' + sep) ? 'public, max-age=31536000, immutable' : 'no-cache' })
    res.end(bytes)
  } catch {
    if (pathname.startsWith('/api/')) return json(res, 404, { error: 'Not found.' })
    try {
      const bytes = await readFile(resolve(DIST, 'index.html'))
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' })
      res.end(bytes)
    } catch { json(res, 503, { error: 'The app is still starting. Please retry shortly.' }) }
  }
}
const server = createServer(async (req, res) => {
  res.setHeader('x-content-type-options', 'nosniff')
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin')
  const url = new URL(req.url, 'http://localhost')
  const route = url.pathname.replace(/^\/First-Website/, '')
  if (req.method === 'GET' && route === '/api/healthz') return json(res, 200, { ok: true, demo: true })
  if (!route.startsWith('/api/')) return serveStatic(req, res)
  if (limited(req)) return json(res, 429, { error: 'Too many requests. Wait a minute and try again.' })
  try {
    const store = await readStore()
    const userId = sessionUser(req)
    const user = store.users.find((item) => item.id === userId)
    if (req.method === 'GET' && route === '/api/auth/me') return json(res, 200, { user: user ? publicUser(user) : null, demo: true })
    if (req.method === 'POST' && route === '/api/auth/signup') {
      const input = await body(req)
      const name = clean(input.name, 100)
      const email = clean(input.email, 254).toLowerCase()
      const password = typeof input.password === 'string' ? input.password : ''
      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 200)
        return json(res, 400, { error: 'Enter a name, valid email, and password with at least 8 characters.' })
      if (store.users.some((item) => item.email === email)) return json(res, 409, { error: 'An account with that email already exists. Try logging in.' })
      const credentials = hashPassword(password)
      const account = { id: randomBytes(16).toString('hex'), name, email, ...credentials, profile: { phone: '', area: '', bio: '', avatarId: null }, createdAt: new Date().toISOString() }
      store.users.push(account)
      await saveStore(store)
      issueSession(res, account)
      return json(res, 201, { user: publicUser(account), demo: true })
    }
    if (req.method === 'POST' && route === '/api/auth/login') {
      const input = await body(req)
      const email = clean(input.email, 254).toLowerCase()
      const password = typeof input.password === 'string' ? input.password : ''
      const account = store.users.find((item) => item.email === email)
      const candidate = account ? hashPassword(password, account.salt).hash : ''
      const valid = account && candidate.length === account.hash.length && timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(account.hash, 'hex'))
      if (!valid) return json(res, 401, { error: 'Email or password is incorrect.' })
      issueSession(res, account)
      return json(res, 200, { user: publicUser(account), demo: true })
    }
    if (req.method === 'POST' && route === '/api/auth/logout') {
      const token = (req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + SESSION_COOKIE + '=([^;]+)'))?.[1]
      if (token) sessions.delete(token)
      cookie(res, '', 0)
      return json(res, 200, { ok: true })
    }
    if (route === '/api/profile') {
      if (!user) return json(res, 401, { error: 'Log in to view or edit your profile.' })
      user.profile ||= { phone: '', area: '', bio: '', avatarId: null }
      if (req.method === 'GET') {
        const { phone = '', area = '', bio = '', avatarId = null } = user.profile
        const documents = (store.profileDocuments || []).filter((item) => item.userId === user.id)
          .map(({ id, name, type, size, createdAt }) => ({ id, name, type, size, createdAt }))
        return json(res, 200, { profile: { name: user.name, email: user.email, phone, area, bio, hasAvatar: Boolean(avatarId) }, documents })
      }
      if (req.method === 'PUT') {
        const input = await body(req)
        const name = clean(input.name, 100)
        const phone = clean(input.phone, 40)
        const area = clean(input.area, 120)
        const bio = clean(input.bio, 500)
        if (name.length < 2) return json(res, 400, { error: 'Enter a name with at least 2 characters.' })
        user.name = name
        user.profile = { ...(user.profile || {}), phone, area, bio }
        await saveStore(store)
        return json(res, 200, { profile: { name, email: user.email, phone, area, bio, hasAvatar: Boolean(user.profile.avatarId) } })
      }
    }
    if (route === '/api/profile/avatar') {
      if (!user) return json(res, 401, { error: 'Log in to view or change your profile photo.' })
      user.profile ||= { phone: '', area: '', bio: '', avatarId: null }
      if (req.method === 'GET') {
        if (!user.profile.avatarId) return json(res, 404, { error: 'No profile photo has been uploaded.' })
        const file = await readFile(resolve(PRIVATE_FILES_DIR, user.profile.avatarId))
        const record = (store.profileFiles || []).find((item) => item.id === user.profile.avatarId && item.userId === user.id)
        if (!record) return json(res, 404, { error: 'Profile photo not found.' })
        res.writeHead(200, { 'content-type': record.type, 'content-length': file.length, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' })
        return res.end(file)
      }
      if (req.method === 'POST') {
        const input = await body(req)
        const { bytes, type } = uploadBuffer(input, ['image/jpeg', 'image/png', 'image/webp'], 3 * 1024 * 1024)
        const id = randomBytes(18).toString('hex')
        await storePrivateFile(id, bytes)
        store.profileFiles ||= []
        store.profileFiles.push({ id, userId: user.id, type, size: bytes.length, createdAt: new Date().toISOString() })
        user.profile.avatarId = id
        await saveStore(store)
        return json(res, 201, { hasAvatar: true })
      }
    }
    if (route === '/api/profile/documents' && req.method === 'POST') {
      if (!user) return json(res, 401, { error: 'Log in to upload a private document.' })
      const input = await body(req)
      const { bytes, type } = uploadBuffer(input, ['application/pdf', 'image/jpeg', 'image/png'], 5 * 1024 * 1024)
      const id = randomBytes(18).toString('hex')
      await storePrivateFile(id, bytes)
      store.profileDocuments ||= []
      store.profileDocuments.unshift({
        id, userId: user.id, name: clean(input.name, 120).split('/').pop().split(String.fromCharCode(92)).pop().split('').filter((char) => char.charCodeAt(0) >= 32).join('') || 'Document',
        type, size: bytes.length, createdAt: new Date().toISOString(),
      })
      await saveStore(store)
      const { userId: _userId, ...document } = store.profileDocuments[0]
      return json(res, 201, { document })
    }
    const documentMatch = route.match(new RegExp('^/api/profile/documents/([a-f0-9]{36})
    if (documentMatch && req.method === 'GET') {
      if (!user) return json(res, 401, { error: 'Log in to download private documents.' })
      const record = (store.profileDocuments || []).find((item) => item.id === documentMatch[1] && item.userId === user.id)
      if (!record) return json(res, 404, { error: 'Document not found.' })
      const file = await readFile(resolve(PRIVATE_FILES_DIR, record.id))
      const asciiName = record.name.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 100) || 'document'
      res.writeHead(200, {
        'content-type': record.type, 'content-length': file.length,
        'content-disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(record.name)}`,
        'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff',
      })
      return res.end(file)
    }
    if (req.method === 'GET' && route === '/api/requests') {
      if (!user) return json(res, 401, { error: 'Log in to view your saved requests.' })
      return json(res, 200, {
        requests: store.requests.filter((item) => item.userId === user.id),
        providerInterests: store.providerInterests.filter((item) => item.userId === user.id),
      })
    }
    if (req.method === 'POST' && route === '/api/requests') {
      if (!user) return json(res, 401, { error: 'Create an account or log in before saving a request.' })
      const input = await body(req)
      const item = {
        id: 'SC-' + randomBytes(5).toString('hex').toUpperCase(), userId: user.id,
        service: clean(input.service, 100), name: user.name, phone: clean(input.phone, 40),
        area: clean(input.area, 120), country: clean(input.country, 100), details: clean(input.details, 1200),
        createdAt: new Date().toISOString(),
      }
      if (!item.service || !item.phone || !item.area || !item.country || !item.details) return json(res, 400, { error: 'Complete all request fields.' })
      store.requests.unshift(item); await saveStore(store)
      const { userId: _userId, ...safe } = item
      return json(res, 201, { request: safe })
    }
    if (req.method === 'POST' && route === '/api/provider-interest') {
      if (!user) return json(res, 401, { error: 'Create an account or log in before saving provider interest.' })
      const input = await body(req)
      const item = {
        id: 'PI-' + randomBytes(5).toString('hex').toUpperCase(), userId: user.id, name: user.name,
        trade: clean(input.trade, 100), area: clean(input.area, 120), country: clean(input.country, 100),
        createdAt: new Date().toISOString(),
      }
      if (!item.trade || !item.area || !item.country) return json(res, 400, { error: 'Complete all provider details.' })
      store.providerInterests.unshift(item); await saveStore(store)
      const { userId: _userId, ...safe } = item
      return json(res, 201, { interest: safe })
    }
    if (req.method === 'POST' && route === '/api/chat') {
      const input = await body(req)
      const message = clean(input.message, 500)
      if (!message) return json(res, 400, { error: 'Write a message first.' })
      return json(res, 200, { reply: 'Thanks for your message. This demo messenger is automated; no live agent or service provider is connected yet.' })
    }
    return json(res, 404, { error: 'Not found.' })
  } catch (error) {
    console.error('Request failed:', error.message)
    return json(res, error.status || 500, { error: error.status ? error.message : 'Something went wrong. Please try again.' })
  }
})
server.listen(PORT, HOST, () => console.log(`ServiceConnect demo listening on ${HOST}:${PORT}`))
))
    if (documentMatch && req.method === 'GET') {
      if (!user) return json(res, 401, { error: 'Log in to download private documents.' })
      const record = (store.profileDocuments || []).find((item) => item.id === documentMatch[1] && item.userId === user.id)
      if (!record) return json(res, 404, { error: 'Document not found.' })
      const file = await readFile(resolve(PRIVATE_FILES_DIR, record.id))
      const asciiName = record.name.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 100) || 'document'
      res.writeHead(200, {
        'content-type': record.type, 'content-length': file.length,
        'content-disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(record.name)}`,
        'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff',
      })
      return res.end(file)
    }
    if (req.method === 'GET' && route === '/api/requests') {
      if (!user) return json(res, 401, { error: 'Log in to view your saved requests.' })
      return json(res, 200, {
        requests: store.requests.filter((item) => item.userId === user.id),
        providerInterests: store.providerInterests.filter((item) => item.userId === user.id),
      })
    }
    if (req.method === 'POST' && route === '/api/requests') {
      if (!user) return json(res, 401, { error: 'Create an account or log in before saving a request.' })
      const input = await body(req)
      const item = {
        id: 'SC-' + randomBytes(5).toString('hex').toUpperCase(), userId: user.id,
        service: clean(input.service, 100), name: user.name, phone: clean(input.phone, 40),
        area: clean(input.area, 120), country: clean(input.country, 100), details: clean(input.details, 1200),
        createdAt: new Date().toISOString(),
      }
      if (!item.service || !item.phone || !item.area || !item.country || !item.details) return json(res, 400, { error: 'Complete all request fields.' })
      store.requests.unshift(item); await saveStore(store)
      const { userId: _userId, ...safe } = item
      return json(res, 201, { request: safe })
    }
    if (req.method === 'POST' && route === '/api/provider-interest') {
      if (!user) return json(res, 401, { error: 'Create an account or log in before saving provider interest.' })
      const input = await body(req)
      const item = {
        id: 'PI-' + randomBytes(5).toString('hex').toUpperCase(), userId: user.id, name: user.name,
        trade: clean(input.trade, 100), area: clean(input.area, 120), country: clean(input.country, 100),
        createdAt: new Date().toISOString(),
      }
      if (!item.trade || !item.area || !item.country) return json(res, 400, { error: 'Complete all provider details.' })
      store.providerInterests.unshift(item); await saveStore(store)
      const { userId: _userId, ...safe } = item
      return json(res, 201, { interest: safe })
    }
    if (req.method === 'POST' && route === '/api/chat') {
      const input = await body(req)
      const message = clean(input.message, 500)
      if (!message) return json(res, 400, { error: 'Write a message first.' })
      return json(res, 200, { reply: 'Thanks for your message. This demo messenger is automated; no live agent or service provider is connected yet.' })
    }
    return json(res, 404, { error: 'Not found.' })
  } catch (error) {
    console.error('Request failed:', error.message)
    return json(res, error.status || 500, { error: error.status ? error.message : 'Something went wrong. Please try again.' })
  }
})
server.listen(PORT, HOST, () => console.log(`ServiceConnect demo listening on ${HOST}:${PORT}`))
