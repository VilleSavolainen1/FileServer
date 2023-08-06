import axios from 'axios'



export const signIn = async (username: string, password: string): Promise<any> => {
   axios.post('/signin', { username: username, password: password }).then(async res => {
      return res
   }).catch(err => {
      return err
   })
}

export const getFolders = async (token: any): Promise<any> => {
   const config = {
      headers: {
         "Content-type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
   };
   axios.get('/folders', config).then(res => {
      return res
   }).catch(err => {
      return err
   })
}

export const saveFileName = async (file: string, folder: any, token: any): Promise<any> => {
   const config = {
      headers: {
         "Content-type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
   };
   axios.post('/save-name', {file, folder}, config).then(res => {
      return res
   }).catch(err => {
      return err
   })
}


export const uploadManyFiles = async (data: any, token: any) => {
   const config = {
      headers: {
         "Authorization": `Bearer ${token}`,
      },
   };
   const res = await axios.post('/upload-array', data, config)
   return res
}

export const getFileNames = async (token: any) => {
   const config = {
      headers: {
         "Content-type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
   };
   const res = await axios.get('/filenames', config)
      return res
}

