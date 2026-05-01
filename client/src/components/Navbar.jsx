// Navbar — Navy · Cream · Teal
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ROLE_BADGE = {
  customer:   { label:'Customer',    bg:'rgba(91,191,212,0.2)',  color:'#1a6a7c' },
  admin:      { label:'Admin',       bg:'rgba(26,20,100,0.12)', color:'#1a1464' },
  superadmin: { label:'Super Admin', bg:'rgba(126,207,222,0.25)',color:'#0e5a69' },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/') }
  const badge = user ? ROLE_BADGE[user.role] : null

  return (
    <nav style={{
      background:'#1a1464',
      borderBottom:'1px solid rgba(91,191,212,0.2)',
      boxShadow:'0 2px 16px rgba(26,20,100,0.3)',
      position:'sticky', top:0, zIndex:50
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div style={{background:'linear-gradient(135deg,#5bbfd4,#7ecfde)'}}
                 className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-sm leading-none text-white">Digital Queue</p>
              <p className="text-xs font-medium" style={{color:'rgba(126,207,222,0.8)'}}>Management System</p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{background:badge?.bg, color:badge?.color}}>
                    {badge?.label}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all border"
                  style={{color:'rgba(200,238,245,0.8)', borderColor:'rgba(91,191,212,0.2)'}}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(91,191,212,0.15)'; e.currentTarget.style.color='#7ecfde' }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(200,238,245,0.8)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login"
                  className="text-sm font-medium px-3 py-2 rounded-lg transition-all"
                  style={{color:'rgba(200,238,245,0.8)'}}>Login</Link>
                <Link to="/register" className="btn-teal text-sm py-2 px-5">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(v => !v)} className="sm:hidden p-2 rounded-lg"
                  style={{color:'rgba(200,238,245,0.8)'}}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {open && (
          <div className="sm:hidden py-3 space-y-1 animate-fade-in border-t"
               style={{borderColor:'rgba(91,191,212,0.2)'}}>
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="font-bold text-white">{user.name}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{background:badge?.bg, color:badge?.color}}>{badge?.label}</span>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm"
                        style={{color:'rgba(200,238,245,0.8)'}}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm" style={{color:'rgba(200,238,245,0.8)'}}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium" style={{color:'#7ecfde'}}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
