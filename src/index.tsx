import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(
  document.getElementById('popup-js') as HTMLElement
)
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)

reportWebVitals()
