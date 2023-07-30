import {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';

function App() {

  return (
    <Router>
      <div>
        <Link to="/">Etusivu</Link>
        <Link to="/login">Kirjaudu</Link>
      </div>

      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;
