// CustomerDashboard.jsx — Navy · Cream · Teal
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const StatusBadge = ({ status }) => {
  const M = { waiting:'badge-waiting', called:'badge-called', completed:'badge-completed', skipped:'badge-skipped' }
  return <span className={M[status]||'badge-waiting'}>{status?.charAt(0).toUpperCase()+status?.slice(1)}</span>
}

export default function CustomerDashboard() {
  const { user }   = useAuth()
  const [status,   setStatus]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [joining,  setJoining]  = useState(false)
  const [error,    setError]    = useState('')
  const [message,  setMessage]  = useState('')
  const [lastPoll, setLastPoll] = useState(null)

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/queue/status')
      setStatus(data); setError('')
    } catch (err) {
      if (err.response?.status === 404) setStatus(null)
      else setError('Could not fetch queue status.')
    } finally { setLoading(false); setLastPoll(new Date()) }
  }, [])

  useEffect(() => {
    fetchStatus()
    const t = setInterval(fetchStatus, 10000)
    return () => clearInterval(t)
  }, [fetchStatus])

  const handleJoin = async () => {
    setJoining(true); setError(''); setMessage('')
    try {
      const { data } = await axios.post('/api/queue/join')
      setMessage(data.message); await fetchStatus()
    } catch (err) { setError(err.response?.data?.message || 'Failed to join queue.') }
    finally { setJoining(false) }
  }

  const token = status?.token
  const now   = status?.currentlyServing

  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--cream)'}}>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">

        <div className="mb-8 animate-fade-in">
          <span className="section-label">Customer Portal</span>
          <h1 className="text-2xl font-black mt-1" style={{color:'var(--navy)'}}>
            Hello, <span style={{color:'#3da8bf'}}>{user?.name}</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{color:'var(--muted)'}}>Track your queue token in real time.</p>
        </div>

        {/* Serving banner */}
        {now && (
          <div className="mb-6 rounded-2xl p-5 flex items-center gap-4 animate-slide-up"
               style={{background:'linear-gradient(135deg,#1a1464,#2d2796)', boxShadow:'0 8px 28px rgba(26,20,100,0.3)'}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 style={{background:'rgba(91,191,212,0.2)'}}>📣</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{color:'#7ecfde'}}>Now Serving</p>
              <p className="text-3xl font-black text-white">Token #{now}</p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {message && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
               style={{background:'rgba(91,191,212,0.15)', border:'1px solid rgba(91,191,212,0.4)', color:'#1a6a7c'}}>
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
               style={{background:'rgba(155,28,28,0.08)', border:'1px solid rgba(155,28,28,0.25)', color:'#9b1c1c'}}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                   style={{borderColor:'#5bbfd4', borderTopColor:'transparent'}} />
              <p className="text-sm" style={{color:'var(--muted)'}}>Loading…</p>
            </div>
          </div>
        ) : token ? (
          <div className="grid sm:grid-cols-2 gap-6 animate-slide-up">

            {/* Token card */}
            <div className="card text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{background:'linear-gradient(90deg,#1a1464,#5bbfd4)'}} />
              <span className="section-label mt-2 block mb-4">Your Token</span>
              <div className="relative w-32 h-32 mx-auto mb-5">
                <div className="absolute inset-1 rounded-3xl flex items-center justify-center"
                     style={{background:'linear-gradient(135deg,#1a1464,#2d2796)',
                             boxShadow:'0 8px 24px rgba(26,20,100,0.35)'}}>
                  <span className="text-4xl font-black text-white">
                    {String(token.tokenNumber).padStart(3,'0')}
                  </span>
                </div>
              </div>
              <StatusBadge status={token.status} />
              <p className="text-xs mt-3" style={{color:'var(--muted)'}}>Issued {new Date(token.createdAt).toLocaleTimeString()}</p>
            </div>

            {/* Info cards */}
            <div className="space-y-4">
              <div className="card flex items-center gap-4" style={{borderLeft:'4px solid #5bbfd4'}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style={{background:'rgba(91,191,212,0.15)'}}>🏁</div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold" style={{color:'var(--muted)'}}>Queue Position</p>
                  <p className="text-3xl font-black" style={{color:'#3da8bf'}}>
                    {token.status==='called' ? '🔔 Called!' : `#${token.queuePosition}`}
                  </p>
                </div>
              </div>

              <div className="card flex items-center gap-4" style={{borderLeft:'4px solid #1a1464'}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style={{background:'rgba(26,20,100,0.08)'}}>⏱️</div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold" style={{color:'var(--muted)'}}>Estimated Wait</p>
                  <p className="text-3xl font-black" style={{color:'var(--navy)'}}>
                    {token.status==='called' ? 'Now!' : `~${token.estimatedWaitTime} min`}
                  </p>
                </div>
              </div>

              {token.status==='called' && (
                <div className="rounded-2xl p-4 text-center animate-pulse-slow"
                     style={{background:'linear-gradient(135deg,#5bbfd4,#3da8bf)',
                             boxShadow:'0 8px 24px rgba(91,191,212,0.35)'}}>
                  <p className="font-black text-lg text-white">🔔 Your turn is here!</p>
                  <p className="text-sm mt-1" style={{color:'rgba(200,238,245,0.9)'}}>Please go to the service counter now.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card text-center py-16 animate-fade-in">
            <div className="text-6xl mb-5 animate-float">🎫</div>
            <h2 className="text-xl font-black mb-2" style={{color:'var(--navy)'}}>You're not in the queue yet</h2>
            <p className="text-sm mb-8 max-w-sm mx-auto" style={{color:'var(--muted)'}}>
              Click below to get your digital token and join instantly.
            </p>
            <button id="join-queue-btn" onClick={handleJoin} disabled={joining} className="btn-teal text-base px-10 py-4">
              {joining ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Joining…</> : <>🎫 Join Queue</>}
            </button>
          </div>
        )}

        {lastPoll && (
          <p className="text-center text-xs mt-6" style={{color:'var(--muted)'}}>
            Last updated: {lastPoll.toLocaleTimeString()} · Auto-refreshes every 10 s
          </p>
        )}
      </main>
    </div>
  )
}
