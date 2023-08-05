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
