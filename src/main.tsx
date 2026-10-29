import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { preloadAssets } from './lib/preload'
import { LANG } from './app/config'
import { STRINGS } from './data/strings'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'

// язык страницы: английский по умолчанию, русский — ?lang=ru
document.documentElement.lang = LANG
document.title = STRINGS.meta.title

preloadAssets()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
