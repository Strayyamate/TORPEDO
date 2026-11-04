import React from 'react'
import ReactDOM from 'react-dom/client'
import * as AppModule from './App.jsx'

// Handles both default exports and named function exports cleanly
const App = AppModule.default || AppModule.App || Object.values(AppModule)[0];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
