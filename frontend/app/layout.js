export const metadata = {
  title: 'TuneMate Auth',
  description: 'Minimal auth-only frontend'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, Arial, sans-serif', background: '#fafafa', margin: 0 }}>
        <nav style={{ display:'flex', gap:'1rem', padding:'0.75rem', borderBottom:'1px solid #ddd' }}>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
        </nav>
        <main style={{ padding: '1rem' }}>{children}</main>
      </body>
    </html>
  )
}
