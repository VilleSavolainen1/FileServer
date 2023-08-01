import { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import { getValueForKey } from './utils';


function App() {
  const [loggedIn, setLoggedIn] = useState(false)


  useEffect(() => {
    const token = getValueForKey('access_token')
    if (token !== ''){
      setLoggedIn(true)
    }
  }, [])


  if (loggedIn) {
    return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    )
  } else {
    return (
      <div>
        <Login />
      </div>
    )
  }
}

export default App;
