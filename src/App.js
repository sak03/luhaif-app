import React, { useState, Component, Suspense } from 'react'
import { 
  HashRouter, 
  Route, 
  Routes,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom'
import './scss/style.scss'
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const Stff = React.lazy(() => import('./views/admin/staff/Staff'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route  
              path="/" 
              name="Login Page" 
              element={<Stff/>}
              />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
