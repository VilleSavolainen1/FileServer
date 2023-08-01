import axios from 'axios'


export const signIn = async (username: string, password: string): Promise<any> => {
   axios.post('/signin', { username: username, password: password }).then(res => {
    return res
   }).catch(err => {
    return err
   })
}