// Login.jsx — Navy · Cream · Teal
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if      (user.role === 'customer')   navigate('/dashboard/customer')
      else if (user.role === 'admin')      navigate('/dashboard/admin')
      else                                 navigate('/dashboard/superadmin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--cream)'}}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-slide-up">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                 style={{background:'linear-gradient(135deg,#1a1464,#5bbfd4)'}}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black" style={{color:'var(--navy)'}}>Welcome back</h1>
            <p className="mt-1 text-sm" style={{color:'var(--muted)'}}>Sign in to your account</p>
          </div>

          {/* Card */}
          <div className="card" style={{borderTop:'4px solid #1a1464'}}>
            {error && (
              <div className="px-4 py-3 rounded-xl mb-5 text-sm"
                   style={{background:'rgba(155,28,28,0.08)', border:'1px solid rgba(155,28,28,0.25)', color:'#9b1c1c'}}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Email Address</label>
                <input id="email" name="email" type="email" required autoComplete="email"
                  value={form.email} onChange={handleChange} placeholder="you@example.com" className="input"/>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Password</label>
                <input id="password" name="password" type="password" required autoComplete="current-password"
                  value={form.password} onChange={handleChange} placeholder="••••••••" className="input"/>
              </div>
              <button type="submit" disabled={loading} id="login-btn" className="btn-primary w-full text-base py-4">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Signing in…</> : 'Sign In →'}
              </button>
            </form>

            <div className="h-px my-6" style={{background:'var(--border)'}} />
            <p className="text-center text-sm" style={{color:'var(--muted)'}}>
              No account?{' '}
              <Link to="/register" className="font-bold hover:underline" style={{color:'#3da8bf'}}>Register here</Link>
            </p>
          </div>

          <div className="mt-4 px-4 py-3 rounded-xl text-xs border"
               style={{background:'rgba(91,191,212,0.1)', borderColor:'rgba(91,191,212,0.3)', color:'#1a6a7c'}}>
            💡 Register with role <strong>customer</strong>, <strong>admin</strong>, or <strong>superadmin</strong> to explore all dashboards.
          </div>
        </div>
      </div>
    </div>
  )
}
