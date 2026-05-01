// Register.jsx — Navy · Cream · Teal
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'customer' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate     = useNavigate()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault(); setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password, form.role)
      if      (user.role === 'customer')   navigate('/dashboard/customer')
      else if (user.role === 'admin')      navigate('/dashboard/admin')
      else                                 navigate('/dashboard/superadmin')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  const ROLE_OPTS = [
    { value:'customer',   label:'👤  Customer (Patient)',    desc:'Join queue, track token',  selBg:'rgba(91,191,212,0.15)',  selBd:'rgba(91,191,212,0.4)',  selClr:'#1a6a7c' },
    { value:'admin',      label:'🎛️  Admin (Service Agent)', desc:'Manage queue & counters',  selBg:'rgba(26,20,100,0.1)',   selBd:'rgba(26,20,100,0.25)',  selClr:'#1a1464' },
    { value:'superadmin', label:'📊  Super Admin',           desc:'Analytics & oversight',   selBg:'rgba(126,207,222,0.18)',selBd:'rgba(91,191,212,0.4)',  selClr:'#0e5a69' },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--cream)'}}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-slide-up">

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                 style={{background:'linear-gradient(135deg,#5bbfd4,#1a1464)'}}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black" style={{color:'var(--navy)'}}>Create account</h1>
            <p className="mt-1 text-sm" style={{color:'var(--muted)'}}>Join the Digital Queue System</p>
          </div>

          <div className="card" style={{borderTop:'4px solid #5bbfd4'}}>
            {error && (
              <div className="px-4 py-3 rounded-xl mb-5 text-sm"
                   style={{background:'rgba(155,28,28,0.08)', border:'1px solid rgba(155,28,28,0.25)', color:'#9b1c1c'}}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { id:'name',     label:'Full Name',  type:'text',     ph:'John Doe',        ac:'name' },
                { id:'email',    label:'Email',       type:'email',    ph:'you@example.com', ac:'email' },
                { id:'password', label:'Password',    type:'password', ph:'Min 6 characters',ac:'new-password' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>{f.label}</label>
                  <input id={f.id} name={f.id} type={f.type} required autoComplete={f.ac}
                    value={form[f.id]} onChange={handleChange} placeholder={f.ph} className="input"/>
                </div>
              ))}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-3" style={{color:'var(--muted)'}}>Account Type</label>
                <div className="space-y-2">
                  {ROLE_OPTS.map(opt => {
                    const sel = form.role === opt.value
                    return (
                      <label key={opt.value}
                             className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
                             style={{background: sel ? opt.selBg : 'var(--cream)', borderColor: sel ? opt.selBd : 'var(--border)'}}>
                        <input type="radio" name="role" value={opt.value} checked={sel} onChange={handleChange} className="sr-only"/>
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                             style={{borderColor: sel ? opt.selClr : 'var(--border)', background: sel ? opt.selClr : 'transparent'}}>
                          {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{color: sel ? opt.selClr : 'var(--navy)'}}>{opt.label}</p>
                          <p className="text-xs" style={{color:'var(--muted)'}}>{opt.desc}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <button type="submit" disabled={loading} id="register-btn" className="btn-teal w-full text-base py-4">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating…</> : 'Create Account →'}
              </button>
            </form>

            <div className="h-px my-6" style={{background:'var(--border)'}} />
            <p className="text-center text-sm" style={{color:'var(--muted)'}}>
              Already registered?{' '}
              <Link to="/login" className="font-bold hover:underline" style={{color:'#3da8bf'}}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
