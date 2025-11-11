'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const base = process.env.NEXT_PUBLIC_API_URL
      if (!base) throw new Error('NEXT_PUBLIC_API_URL is not set')
      const url = `${base.replace(/\/$/, '')}/api/auth/login`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        const text = await res.text()
        throw new Error(`Unexpected response (status ${res.status}). Body: ${text.slice(0, 200)}`)
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Login failed (status ${res.status})`)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type='submit'>Login</button>
      </form>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      {token && (
        <div style={{ marginTop:'1rem' }}>
          <p>JWT (copy & verify at jwt.io):</p>
          <textarea readOnly style={{ width:'100%', height:'140px' }} value={token} />
        </div>
      )}
    </div>
  )
}
