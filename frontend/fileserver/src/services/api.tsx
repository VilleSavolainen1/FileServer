import axios from 'axios'


export const saveFileName = async (file: string, folder: any, token: any): Promise<any> => {
   const config = {
      headers: {
         "Content-type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
   };
   axios.post('/save-name', { file, folder }, config).then(res => {
      return res
   }).catch(err => {
      return err
   })
}


export const uploadManyFiles = async (data: any, token: any) => {
   console.log('DATA: ', data)
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

export const deleteFolder = async (foldername: string, token: any) => {
   const config = {
      headers: {
         "Content-type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
   };
   axios.post('/deletefolder', { folder: foldername }, config).then(res => {
      return res
   }).catch(err => {
      return err
   })
}

export const deleteFile = async (filename: string, id: string, token: any) => {
   const config = {
      headers: {
         "Content-type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
   };
   axios.post('/delete', { file: filename, id: id }, config).then(res => {
      return res
   }).catch(err => {
      return err
   })
}


