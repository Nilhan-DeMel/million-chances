import { useState } from 'react'
import LandingPage from './components/LandingPage'
import './index.css'

function App() {
  return (
    <div className="app-container">
      <div className="bg-gradient-orb" style={{ top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'hsl(var(--color-primary))' }}></div>
      <div className="bg-gradient-orb" style={{ bottom: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'hsl(var(--color-accent))' }}></div>
      <LandingPage />
    </div>
  )
}

export default App
