import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { preloadAssets } from './lib/preload'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'

preloadAssets()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
