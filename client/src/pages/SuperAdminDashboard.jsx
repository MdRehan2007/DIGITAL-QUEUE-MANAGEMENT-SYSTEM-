// SuperAdminDashboard.jsx — Navy · Cream · Teal
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const StatCard = ({ label, value, icon, bg, border, color }) => (
  <div className="rounded-2xl p-5 text-center border transition-all hover:-translate-y-1"
       style={{background:bg, borderColor:border, borderTop:`4px solid ${color}`,
               boxShadow:'0 2px 8px rgba(26,20,100,0.06)'}}>
    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-4xl font-black mb-1" style={{color}}>{value}</p>
    <p className="text-xs uppercase tracking-wider font-bold" style={{color:'var(--muted)'}}>{label}</p>
  </div>
)

const PERF = {
  Excellent: { gradient:'linear-gradient(135deg,#5bbfd4,#3da8bf)', emoji:'🚀', bar:'100%', sub:'Outstanding performance' },
  Good:      { gradient:'linear-gradient(135deg,#1a1464,#2d2796)', emoji:'✅', bar:'75%',  sub:'Running smoothly'        },
  Average:   { gradient:'linear-gradient(135deg,#2d2796,#5bbfd4)', emoji:'⚡', bar:'50%',  sub:'Could be improved'       },
  Poor:      { gradient:'linear-gradient(135deg,#7b1c1c,#9b3226)', emoji:'⚠️', bar:'25%', sub:'Needs attention'         },
}

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [msg,       setMsg]       = useState('')
  const [err,       setErr]       = useState('')
  const [resetting, setResetting] = useState(false)
  const [lastPoll,  setLastPoll]  = useState(null)

  const fetchAnalytics = useCallback(async () => {
    try { const { data: r } = await axios.get('/api/queue/analytics'); setData(r) }
    catch {} finally { setLoading(false); setLastPoll(new Date()) }
  }, [])

  useEffect(() => { fetchAnalytics(); const t = setInterval(fetchAnalytics, 15000); return () => clearInterval(t) }, [fetchAnalytics])
  useEffect(() => {
    if (msg || err) { const t = setTimeout(() => { setMsg(''); setErr('') }, 4000); return () => clearTimeout(t) }
  }, [msg, err])

  const handleReset = async () => {
    if (!window.confirm('RESET the entire queue? This cannot be undone!')) return
    setResetting(true)
    try { const { data: r } = await axios.post('/api/queue/reset'); setMsg(r.message); await fetchAnalytics() }
    catch (e) { setErr(e.response?.data?.message || 'Reset failed.') }
    finally { setResetting(false) }
  }

  const analytics = data?.analytics || {}
  const live      = data?.live      || {}
  const perf      = PERF[analytics.queuePerformance] || PERF.Good

  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--cream)'}}>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <span className="section-label">Super Admin Portal</span>
            <h1 className="text-2xl font-black mt-1" style={{color:'var(--navy)'}}>
              System <span style={{color:'#3da8bf'}}>Analytics</span>
            </h1>
            <p className="text-sm" style={{color:'var(--muted)'}}>Welcome, {user?.name}</p>
          </div>
          <button id="reset-queue-btn" onClick={handleReset} disabled={resetting}
            className="btn-danger flex items-center gap-2 text-sm px-5 py-3">
            {resetting ? <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"/> : '🗑️'}
            Reset Queue
          </button>
        </div>

        {msg && <div className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
                     style={{background:'rgba(91,191,212,0.15)',border:'1px solid rgba(91,191,212,0.4)',color:'#1a6a7c'}}>✅ {msg}</div>}
        {err && <div className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
                     style={{background:'rgba(155,28,28,0.08)',border:'1px solid rgba(155,28,28,0.25)',color:'#9b1c1c'}}>⚠️ {err}</div>}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                 style={{borderColor:'#5bbfd4', borderTopColor:'transparent'}} />
          </div>
        ) : (
          <>
            {/* Live stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
              <StatCard label="Waiting Now"  value={live.waitingNow??0}   icon="⏳" bg="rgba(91,191,212,0.1)"  border="rgba(91,191,212,0.3)"  color="#5bbfd4" />
              <StatCard label="Being Served" value={live.calledNow??0}    icon="🔔" bg="rgba(26,20,100,0.07)"  border="rgba(26,20,100,0.2)"   color="#1a1464" />
              <StatCard label="Completed"    value={live.completedAll??0} icon="✅" bg="rgba(126,207,222,0.12)"border="rgba(91,191,212,0.35)"  color="#3da8bf" />
              <StatCard label="Skipped"      value={live.skippedAll??0}   icon="⏭️" bg="rgba(26,20,100,0.04)" border="var(--border)"           color="var(--muted)" />
            </div>

            {/* Analytics row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-slide-up">

              <div className="card relative overflow-hidden">
                <div style={{height:'3px', marginTop:'-24px', marginLeft:'-24px', marginRight:'-24px', marginBottom:'18px',
                             background:'linear-gradient(90deg,#1a1464,#5bbfd4)'}} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                       style={{background:'rgba(91,191,212,0.15)'}}>👥</div>
                  <p className="font-bold text-sm" style={{color:'var(--muted)'}}>Total Customers</p>
                </div>
                <p className="text-6xl font-black" style={{color:'var(--navy)'}}>{analytics.totalCustomers??0}</p>
                <p className="text-xs mt-2" style={{color:'var(--muted)'}}>All-time queue registrations</p>
              </div>

              <div className="card relative overflow-hidden">
                <div style={{height:'3px', marginTop:'-24px', marginLeft:'-24px', marginRight:'-24px', marginBottom:'18px',
                             background:'linear-gradient(90deg,#5bbfd4,#7ecfde)'}} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                       style={{background:'rgba(91,191,212,0.15)'}}>⏱️</div>
                  <p className="font-bold text-sm" style={{color:'var(--muted)'}}>Avg Service Time</p>
                </div>
                <p className="text-6xl font-black" style={{color:'#3da8bf'}}>
                  {(analytics.averageServiceTime??0).toFixed(1)}
                  <span className="text-2xl font-semibold ml-1" style={{color:'var(--muted)'}}>min</span>
                </p>
                <p className="text-xs mt-2" style={{color:'var(--muted)'}}>Per customer served</p>
              </div>

              <div className="card relative overflow-hidden">
                <div style={{height:'3px', marginTop:'-24px', marginLeft:'-24px', marginRight:'-24px', marginBottom:'18px',
                             background:'linear-gradient(90deg,#2d2796,#1a1464)'}} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                       style={{background:'rgba(26,20,100,0.08)'}}>📈</div>
                  <p className="font-bold text-sm" style={{color:'var(--muted)'}}>Completion Rate</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label:'Completed', count:analytics.completedCount??0, color:'#3da8bf', track:'rgba(91,191,212,0.2)' },
                    { label:'Skipped',   count:analytics.skippedCount??0,   color:'#9d98b8', track:'rgba(26,20,100,0.1)'  },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span style={{color:'var(--muted)'}}>{item.label}</span>
                        <span className="font-black" style={{color:item.color}}>{item.count}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full" style={{background:item.track}}>
                        <div className="h-2.5 rounded-full transition-all duration-700"
                             style={{width:live.totalAll?`${Math.round((item.count/live.totalAll)*100)}%`:'0%', background:item.color}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance banner */}
            <div className="rounded-2xl overflow-hidden animate-slide-up shadow-xl"
                 style={{background:perf.gradient}}>
              <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="text-7xl">{perf.emoji}</div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                     style={{color:'rgba(200,238,245,0.8)'}}>Overall Queue Performance</p>
                  <p className="text-5xl font-black text-white mb-1">{analytics.queuePerformance||'Good'}</p>
                  <p className="text-sm mb-4" style={{color:'rgba(255,255,255,0.65)'}}>
                    {perf.sub} · {analytics.completedCount??0} completed · {(analytics.averageServiceTime??0).toFixed(1)} min avg
                  </p>
                  <div className="h-2.5 w-full sm:max-w-xs rounded-full" style={{background:'rgba(0,0,0,0.2)'}}>
                    <div className="h-2.5 rounded-full" style={{width:perf.bar, background:'rgba(255,255,255,0.8)'}} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {lastPoll && (
          <p className="text-center text-xs mt-6" style={{color:'var(--muted)'}}>
            Last updated: {lastPoll.toLocaleTimeString()} · Auto-refreshes every 15 s
          </p>
        )}
      </main>
    </div>
  )
}
