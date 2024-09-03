import axios from 'axios'
const API_URL = 'http://localhost:5000';

//get all Users
export const getUsers = async()=>{
    const response = await axios.get(`${API_URL}/users/getUsers`);
    return response;
}

//create a User
export const createUser = async(user)=>{
    const response = await axios.post (`${API_URL}/users/createUser`, user);
    return response;
}