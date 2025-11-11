require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const app = express()

const PORT = process.env.PORT || 4000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*'
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
	console.warn('JWT_SECRET not set - auth tokens will fail to verify')
}

app.use(express.json())
app.use(cors({
	origin: FRONTEND_ORIGIN === '*' ? true : FRONTEND_ORIGIN.split(',').map(s => s.trim()),
	credentials: true
}))

app.get('/health', (req, res) => {
	res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
})

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
	console.log(`Backend running on http://localhost:${PORT}`)
})
