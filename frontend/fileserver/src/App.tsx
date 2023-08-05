import { useState, useEffect } from 'react';
import './App.css';
import {
  Routes, Route, useNavigate
} from 'react-router-dom'
import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import { deleteValueForKey, getValueForKey } from './utils';
import FilesView from './components/FilesView';
import TopBar from './components/TopBar';
import axios from 'axios';
import { Folder, diskSpace } from './types';
import Loader from './components/Loader';

type State = {
  folders: Folder
  diskSpace: diskSpace
}

const initialState: State = {
  folders: { id: 0, name: '' },
  diskSpace: {
    free: 0, size: 0,
    diskPath: ''
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [folders, setFolders] = useState([initialState.folders])
  const [diskSpace, setDiskSpace] = useState(initialState.diskSpace)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const isLoading = (value: boolean) => {
    setLoading(value)
  }

  const logOut = () => {
    deleteValueForKey('access_token')
    navigate('/login')
  }


  useEffect(() => {
    const token = getValueForKey('access_token')
    if (token) {
      setLoggedIn(true)
    }
  }, [])

  const getFolders = () => {
    const token = getValueForKey('access_token')
    const config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    axios.get('/folders', config).then(res => {
      setFolders(res.data)
    }).catch(() => {
      navigate('\login')
    })
  }

  const getFileSpace = () => {
    setLoading(true)
    axios.get('/disk').then(res => {
      if (res.data) {
        setLoading(false)
        setDiskSpace(res.data)
      } else {
        setLoading(false)
      }
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    getFileSpace()
  }, [])

  useEffect(() => {
    getFolders()
  }, [])


  
    if (loading) {
      return (
        <div className="main">
          <div className="foldersView">
            <div className="foldersContent">
              <Loader />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Routes>
            <Route path="/" element={<Home folders={folders} isLoading={isLoading} logOut={logOut} diskSpace={diskSpace} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/folders/:name" element={<FilesView folders={folders} isLoading={isLoading} logOut={logOut} diskSpace={diskSpace} />} />
          </Routes>
        </div>
      )
    }
  }

export default App;
