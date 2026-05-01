// ===================================================
// src/context/AuthContext.jsx
// Global authentication context using React's
// Context API + useReducer pattern.
//
// Stores: { user, token } in state and localStorage.
// Exposes: login(), logout(), register() helpers.
// ===================================================
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

// ─── Create the context ───────────────────────────
const AuthContext = createContext(null)

// ─── Reducer ──────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, loading: false }
    case 'LOGOUT':
      return { user: null, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user:    null,
    loading: true,
  })

  // On mount: restore user from localStorage if token is saved
  useEffect(() => {
    const savedUser = localStorage.getItem('queueUser')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      dispatch({ type: 'LOGIN', payload: parsed })
      // Set default Authorization header for all Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // ─── login ────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('queueUser', JSON.stringify(data))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    dispatch({ type: 'LOGIN', payload: data })
    return data
  }

  // ─── register ─────────────────────────────────────
  const register = async (name, email, password, role = 'customer') => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, role })
    localStorage.setItem('queueUser', JSON.stringify(data))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    dispatch({ type: 'LOGIN', payload: data })
    return data
  }

  // ─── logout ───────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('queueUser')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Custom hook ──────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
