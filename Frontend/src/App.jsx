import { useState,useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'

import Login from './components/login/login';
import Signup from './components/signup/signup';
import Dashboard from './components/Dashboard';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

function App() {
	const [credentials, setCredentials] = useState({ username: "", password: "" });

  return (
   
      <div style={{backgroundColor:"rgb(25 63 193 / 55%",height:"100vh"}} >
       <h1 style={{textAlign:"center",color:"white"}}>Expense Tracker</h1>
       <div className='container'>
          <Router>
            <Provider theme={defaultTheme}>
              <Routes>
                <Route path="/" element={<Login credentials={credentials} setCredentials={setCredentials} />} />
                <Route path="/dashboard" element={<Dashboard credentials={credentials} setCredentials={setCredentials} />} />
                <Route path="/signup" element={<Signup credentials={credentials} setCredentials={setCredentials} />} />
              </Routes>
            </Provider>
          </Router>
          <ToastContainer />
       </div>
      </div>
 
  )
}

export default App