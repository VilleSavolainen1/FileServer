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
import { create } from 'domain';
import { deleteFile, deleteFolder, getFileNames } from './services';

type State = {
  folders: Folder
  diskSpace: diskSpace
}

const initialState: State = {
  folders: { name: '', id: 0 },
  diskSpace: {
    free: 0, size: 0,
    diskPath: ''
  }
}

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
]

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [folders, setFolders] = useState([initialState.folders])
  const [diskSpace, setDiskSpace] = useState(initialState.diskSpace)
  const [loading, setLoading] = useState(false)

  let timer: any;

  const navigate = useNavigate()

  const isLoading = (value: boolean) => {
    setLoading(value)
  }

  const logOut = () => {
    deleteValueForKey('access_token')
    navigate('/login')
  }

  const setHasLoggedIn = (value: boolean) => {
    setLoggedIn(value)
  }


  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logOut();
    }, 1800000); // 30min = 1800000
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, [handleLogoutTimer, resetTimer]);


  useEffect(() => {
    const token = getValueForKey('access_token')
    if (token) {
      setLoggedIn(true)
    }
  }, [])

  const getFolders = () => {
    setLoading(true)
    const token = getValueForKey('access_token')
    const config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    axios.get('/folders', config).then(res => {
      setFolders(res.data)
      setLoading(false)
    }).catch(() => {
      setLoggedIn(false)
      setLoading(false)
      navigate('/login')
    })
  }

  const getFileSpace = async () => {
    setLoading(true)
    axios.get('/disk').then(res => {
      if (res.data) {
        setLoading(false)
        getFolders()
        setDiskSpace(res.data)
      } else {
        getFolders()
      }
    }).catch(err => {
      getFolders()
      console.log(err)
    })
  }

  const createFolder = (folder: string) => {
    if (folders.some(fldr => fldr.name === folder)) {
      return window.alert('Kansio on jo olemassa')
    } else {
      const token = getValueForKey('access_token')
      const config = {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
      axios.post('/create-folder', { folder: folder }, config).then(res => {
        console.log(res)
        getFolders()
      }).catch(() => {
        navigate('/login')
      })
    }
  }


  const getCurrentFolderFileNames = async (foldername: string) => {
    setLoading(true)
    const token = getValueForKey('access_token')
    const files = await getFileNames(token)
    const data = files.data
    const currentFolderFiles = data.filter((file: any) => file.folder === foldername)
    setLoading(false)
    return currentFolderFiles
  }

  const deleteSelectedFolder = (foldername: string) => {
    const token = getValueForKey('access_token')
    getCurrentFolderFileNames(foldername).then(files => {
      if (files.length > 0) {
        window.alert('Kansio ei ole tyhjä')
      } else {
        deleteFolder(foldername, token).then(() => {
          getFolders()
        })
      }
    })
  }

  const deleteSelectedFile = async (filename: string, id: string) => {
    const token = getValueForKey('access_token')
    deleteFile(filename, id, token).then(() => {
      getFolders()
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (loggedIn) {
      getFileSpace()
    }
  }, [loggedIn])

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
      <Routes>
        <Route path="/" element={<Home folders={folders} isLoading={isLoading} logOut={logOut} diskSpace={diskSpace} createFolder={createFolder} deleteSelectedFolder={deleteSelectedFolder} />} />
        <Route path="/login" element={<Login setHasLoggedIn={setHasLoggedIn} />} />
        <Route path="/:foldername" element={<FilesView folders={folders} isLoading={isLoading} logOut={logOut} diskSpace={diskSpace} deleteSelectedFile={deleteSelectedFile} />} />
      </Routes>
    )
  }
}

export default App;
