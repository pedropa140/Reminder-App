import axios from 'axios'
const API_URL = 'http://localhost:5000';


export const getUsers = async()=>{
    const response = await axios.get(`${API_URL}/users/getUsers`);
    return response;
}