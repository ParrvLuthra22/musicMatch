'use client'
import { useState } from 'react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL
      if (!base) throw new Error('NEXT_PUBLIC_API_URL is not set')
      const url = `${base.replace(/\/$/, '')}/api/auth/signup`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        const text = await res.text()
        throw new Error(`Unexpected response (status ${res.status}). Body: ${text.slice(0, 200)}`)
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Signup failed (status ${res.status})`)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Signup</h2>
      <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type='submit'>Create Account</button>
      </form>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      {success && <p style={{ color:'green' }}>Account created. You can now login.</p>}
    </div>
  )
}
