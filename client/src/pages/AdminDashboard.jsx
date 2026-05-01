// AdminDashboard.jsx — Navy · Cream · Teal
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const badgeClass = s => ({ waiting:'badge-waiting', called:'badge-called', completed:'badge-completed', skipped:'badge-skipped' }[s]||'badge-waiting')

const SummaryCard = ({ label, count, icon, bg, border, leftColor }) => (
  <div className="rounded-2xl p-5 flex items-center gap-4 border"
       style={{background:bg, borderColor:border, borderLeft:`4px solid ${leftColor}`,
               boxShadow:'0 2px 8px rgba(26,20,100,0.06)'}}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-xs uppercase tracking-wider font-bold" style={{color:'var(--muted)'}}>{label}</p>
      <p className="text-3xl font-black" style={{color:leftColor}}>{count}</p>
    </div>
  </div>
)

export default function AdminDashboard() {
  const { user } = useAuth()
  const [data,     setData]     = useState(null)
  const [counters, setCounters] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [actionMsg, setActionMsg] = useState('')
  const [actionErr, setActionErr] = useState('')
  const [busy, setBusy] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const [q, c] = await Promise.all([axios.get('/api/queue/all'), axios.get('/api/queue/counters')])
      setData(q.data); setCounters(c.data)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll(); const t = setInterval(fetchAll, 8000); return () => clearInterval(t) }, [fetchAll])
  useEffect(() => {
    if (actionMsg || actionErr) { const t = setTimeout(() => { setActionMsg(''); setActionErr('') }, 4000); return () => clearTimeout(t) }
  }, [actionMsg, actionErr])

  const handleNext = async () => {
    setBusy(true); setActionMsg(''); setActionErr('')
    try { const { data: r } = await axios.post('/api/queue/next'); setActionMsg(r.message); await fetchAll() }
    catch (err) { setActionErr(err.response?.data?.message || 'Failed to call next token.') }
    finally { setBusy(false) }
  }

  const handleSkip = async (tokenId) => {
    setBusy(true); setActionMsg(''); setActionErr('')
    try { const { data: r } = await axios.post('/api/queue/skip', { tokenId }); setActionMsg(r.message); await fetchAll() }
    catch (err) { setActionErr(err.response?.data?.message || 'Failed to skip.') }
    finally { setBusy(false) }
  }

  const summary = data?.summary || {}
  const tokens  = data?.tokens  || []
  const serving = data?.currentlyServing

  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--cream)'}}>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <span className="section-label">Admin Portal</span>
            <h1 className="text-2xl font-black mt-1" style={{color:'var(--navy)'}}>
              Queue <span style={{color:'#3da8bf'}}>Control Center</span>
            </h1>
            <p className="text-sm" style={{color:'var(--muted)'}}>Welcome, {user?.name}</p>
          </div>
          <button id="call-next-btn" onClick={handleNext} disabled={busy} className="btn-success text-sm px-7">
            {busy ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : '📣'}
            Call Next Token
          </button>
        </div>

        {actionMsg && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
               style={{background:'rgba(91,191,212,0.15)', border:'1px solid rgba(91,191,212,0.4)', color:'#1a6a7c'}}>✅ {actionMsg}</div>
        )}
        {actionErr && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
               style={{background:'rgba(155,28,28,0.08)', border:'1px solid rgba(155,28,28,0.25)', color:'#9b1c1c'}}>⚠️ {actionErr}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                 style={{borderColor:'#5bbfd4', borderTopColor:'transparent'}} />
          </div>
        ) : (
          <>
            {/* Serving banner */}
            {serving && (
              <div className="mb-6 rounded-2xl p-5 flex items-center gap-4 animate-slide-up"
                   style={{background:'linear-gradient(135deg,#5bbfd4,#3da8bf)', boxShadow:'0 8px 28px rgba(91,191,212,0.3)'}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style={{background:'rgba(255,255,255,0.2)'}}>🔔</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{color:'rgba(200,238,245,0.9)'}}>Now Serving</p>
                  <p className="text-2xl font-black text-white">
                    Token #{serving.tokenNumber} — {serving.userId?.name || 'Customer'}
                  </p>
                </div>
              </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
              <SummaryCard label="Waiting"   count={summary.waiting||0}   icon="⏳" bg="rgba(91,191,212,0.1)"  border="rgba(91,191,212,0.3)"  leftColor="#5bbfd4" />
              <SummaryCard label="Called"    count={summary.called||0}    icon="🔔" bg="rgba(26,20,100,0.07)"  border="rgba(26,20,100,0.2)"   leftColor="#1a1464" />
              <SummaryCard label="Completed" count={summary.completed||0} icon="✅" bg="rgba(126,207,222,0.12)"border="rgba(91,191,212,0.35)"  leftColor="#3da8bf" />
              <SummaryCard label="Skipped"   count={summary.skipped||0}   icon="⏭️" bg="rgba(26,20,100,0.04)" border="var(--border)"           leftColor="var(--muted)" />
            </div>

            {/* Token table */}
            <div className="card mb-8 animate-slide-up overflow-hidden">
              <div style={{height:'4px', marginTop:'-24px', marginLeft:'-24px', marginRight:'-24px', marginBottom:'20px',
                           background:'linear-gradient(90deg,#1a1464,#5bbfd4,#7ecfde)', borderRadius:'16px 16px 0 0'}} />
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-lg" style={{color:'var(--navy)'}}>Queue Tokens</h2>
                <span className="text-xs font-medium" style={{color:'var(--muted)'}}>{summary.total||0} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{borderBottom:'2px solid var(--border)'}}>
                      {['Token','Customer','Position','Wait','Status','Issued','Action'].map(h => (
                        <th key={h} className="text-left py-3 px-2 text-xs font-black uppercase tracking-wider"
                            style={{color:'var(--muted)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.length===0 ? (
                      <tr><td colSpan={7} className="py-12 text-center" style={{color:'var(--muted)'}}>Queue is empty.</td></tr>
                    ) : tokens.map(t => (
                      <tr key={t._id} className="transition-colors hover:bg-opacity-50"
                          style={{borderBottom:'1px solid var(--border)'}}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(91,191,212,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td className="py-3 px-2 font-black" style={{color:'#1a1464'}}>#{String(t.tokenNumber).padStart(3,'0')}</td>
                        <td className="py-3 px-2">
                          <p className="font-semibold" style={{color:'var(--navy)'}}>{t.userId?.name||'N/A'}</p>
                          <p className="text-xs" style={{color:'var(--muted)'}}>{t.userId?.email||''}</p>
                        </td>
                        <td className="py-3 px-2" style={{color:'var(--muted)'}}>{t.status==='waiting'?`#${t.queuePosition}`:'—'}</td>
                        <td className="py-3 px-2" style={{color:'var(--muted)'}}>{t.status==='waiting'?`~${t.estimatedWaitTime}m`:'—'}</td>
                        <td className="py-3 px-2"><span className={badgeClass(t.status)}>{t.status}</span></td>
                        <td className="py-3 px-2 text-xs" style={{color:'var(--muted)'}}>{new Date(t.createdAt).toLocaleTimeString()}</td>
                        <td className="py-3 px-2">
                          {(t.status==='waiting'||t.status==='called') && (
                            <button id={`skip-${t._id}`} onClick={() => handleSkip(t._id)} disabled={busy} className="btn-danger">Skip</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Counters */}
            <div className="card animate-slide-up">
              <h2 className="font-black text-lg mb-5" style={{color:'var(--navy)'}}>Service Counters</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {counters.map(c => {
                  const cfg = c.status==='open'
                    ? { bg:'rgba(91,191,212,0.12)',  bd:'rgba(91,191,212,0.35)', dot:'#5bbfd4', lbl:'Open',   clr:'#1a6a7c' }
                    : c.status==='busy'
                    ? { bg:'rgba(26,20,100,0.08)',   bd:'rgba(26,20,100,0.2)',   dot:'#1a1464', lbl:'Busy',   clr:'#1a1464' }
                    : { bg:'rgba(26,20,100,0.04)',   bd:'var(--border)',          dot:'#9d98b8', lbl:'Closed', clr:'var(--muted)' }
                  return (
                    <div key={c._id} className="rounded-xl border p-4 transition-all hover:-translate-y-0.5"
                         style={{background:cfg.bg, borderColor:cfg.bd}}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black" style={{color:'var(--navy)'}}>{c.counterName}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{background:cfg.dot}} />
                          <span className="text-xs font-bold" style={{color:cfg.clr}}>{cfg.lbl}</span>
                        </div>
                      </div>
                      <p className="text-xs" style={{color:'var(--muted)'}}>
                        {c.assignedAgent ? `👤 ${c.assignedAgent.name}` : 'No agent assigned'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
