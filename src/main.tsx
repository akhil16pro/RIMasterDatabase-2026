import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './lang'

// Styles
import './assets/scss/tailwind.css'
import './assets/scss/app.scss'

// Root
const rootElement = document.getElementById('root')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <App />
  )
}
 