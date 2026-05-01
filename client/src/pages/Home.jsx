// Home.jsx — Navy · Cream · Teal
import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const FEATURES = [
  { emoji:'🎫', title:'Digital Token',       desc:'Auto-numbered tokens instantly. No paper needed.',      bg:'rgba(91,191,212,0.12)',  border:'rgba(91,191,212,0.3)',  color:'#1a6a7c' },
  { emoji:'📡', title:'Live Queue Tracking',  desc:'Real-time position & wait time, refreshed every 10 s.', bg:'rgba(26,20,100,0.07)',   border:'rgba(26,20,100,0.15)', color:'#1a1464' },
  { emoji:'🎛️', title:'Admin Controls',      desc:'Call next, skip tokens, manage counters with ease.',    bg:'rgba(126,207,222,0.15)', border:'rgba(91,191,212,0.35)',color:'#0e5a69' },
  { emoji:'📊', title:'Analytics',           desc:'Track customers, avg service time, and performance.',    bg:'rgba(26,20,100,0.05)',   border:'var(--border)',        color:'#2d2796' },
]

const ROLES = [
  { icon:'👤', title:'Customer',    sub:'Self-service portal',  desc:'Join queue · Track token · See wait time',  bar:'linear-gradient(90deg,#1a1464,#2d2796)' },
  { icon:'🎛️', title:'Admin',       sub:'Queue control',       desc:'Call next · Skip · Manage counters',        bar:'linear-gradient(90deg,#5bbfd4,#7ecfde)'  },
  { icon:'📊', title:'Super Admin', sub:'System oversight',    desc:'Analytics · Performance · Full reporting',  bar:'linear-gradient(90deg,#3da8bf,#5bbfd4)'  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--cream)'}}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────── */}
      <section style={{background:'linear-gradient(160deg,#1a1464 0%,#0f0c4e 50%,#1a6a7c 100%)'}}
               className="relative overflow-hidden py-24 px-4 sm:px-6">
        {/* Subtle dot overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
             style={{backgroundImage:"radial-gradient(circle, rgba(91,191,212,1) 1px, transparent 1px)", backgroundSize:"32px 32px"}} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-bold"
               style={{background:'rgba(91,191,212,0.15)', border:'1px solid rgba(91,191,212,0.35)', color:'#7ecfde'}}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{background:'#7ecfde'}} />
            System is Live
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
            Smart Queue,{' '}
            <span style={{background:'linear-gradient(135deg,#7ecfde,#c8eef5)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              Zero Chaos
            </span>
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up"
             style={{color:'rgba(200,238,245,0.8)'}}>
            Replace paper tickets with digital tokens. Track your live position, get estimated wait times,
            and let admins manage everything from a clean dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/register" className="btn-teal text-base py-4 px-10">
              🎫 Get Your Token
            </Link>
            <Link to="/login"
              className="font-bold text-base py-4 px-10 rounded-xl transition-all"
              style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff'}}>
              Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* Stripe */}
      <div style={{height:'4px', background:'linear-gradient(90deg,#1a1464,#5bbfd4,#7ecfde,#1a1464)'}} />

      {/* ── Features ──────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <p className="section-label text-center mb-2">What We Offer</p>
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-14" style={{color:'var(--navy)'}}>
          Everything in one platform
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <div key={f.title}
                 className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2"
                 style={{background:f.bg, borderColor:f.border, boxShadow:'0 4px 16px rgba(26,20,100,0.07)'}}>
              <div className="text-4xl mb-4 animate-float">{f.emoji}</div>
              <h3 className="font-black mb-2" style={{color:f.color}}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{color:'var(--text-body)'}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────── */}
      <section className="py-12 px-4" style={{background:'var(--cream-dark)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { val:'FIFO', label:'Queue Logic',  color:'#1a1464' },
            { val:'10s',  label:'Live Refresh', color:'#3da8bf' },
            { val:'3',    label:'User Roles',   color:'#1a1464' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{color:s.color}}>{s.val}</p>
              <p className="text-sm font-semibold" style={{color:'var(--muted)'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roles ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <p className="section-label text-center mb-2">Access Levels</p>
        <h2 className="text-3xl font-black text-center mb-12" style={{color:'var(--navy)'}}>Three powerful roles</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {ROLES.map(r => (
            <div key={r.title} className="card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{background:r.bar}} />
              <div className="mt-2 text-5xl mb-4">{r.icon}</div>
              <p className="section-label mb-1">{r.sub}</p>
              <h3 className="text-xl font-black mb-2" style={{color:'var(--navy)'}}>{r.title}</h3>
              <p className="text-sm" style={{color:'var(--muted)'}}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
             style={{background:'linear-gradient(135deg,#1a1464,#0f0c4e)', boxShadow:'0 20px 60px rgba(26,20,100,0.3)'}}>
          <div className="absolute inset-0 pointer-events-none opacity-10"
               style={{backgroundImage:"radial-gradient(circle, rgba(91,191,212,1) 1px, transparent 1px)", backgroundSize:"28px 28px"}} />
          <p className="relative section-label mb-3" style={{color:'#7ecfde'}}>Get Started Today</p>
          <h2 className="relative text-4xl font-black text-white mb-4">Skip the line, not the service</h2>
          <p className="relative mb-8" style={{color:'rgba(200,238,245,0.75)'}}>Register in seconds and join the smarter way to wait.</p>
          <Link to="/register"
            className="inline-block font-black py-4 px-12 rounded-xl transition-all hover:-translate-y-1"
            style={{background:'#5bbfd4', color:'#fff', boxShadow:'0 8px 24px rgba(91,191,212,0.4)'}}>
            Create Free Account →
          </Link>
        </div>
      </section>

      <footer className="py-6 text-center border-t" style={{borderColor:'var(--border)', color:'var(--muted)'}}>
        <p className="text-sm">© {new Date().getFullYear()} Digital Queue Management System</p>
      </footer>
    </div>
  )
}
