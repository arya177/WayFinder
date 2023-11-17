import axios from 'axios';

  export const addUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/addUser', userData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error('Error adding user:', error.response.data); // Handle error
    }
  };

  export const getUser = async (uid) => {
    try {
      const response = await axios.get(`http://localhost:3000/getUser/${uid}`);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error('Error getting user:', error.response.data); // Handle error
    }
  };

  export const updateUser = async (uid, updatedUserData) => {
    try {
      const response = await axios.put(`http://localhost:3000/updateUser/${uid}`, updatedUserData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error('Error updating user:', error.response.data); // Handle error
    }
  };

  export const deleteUser = async (uid) => {
    try {
        const response = await axios.delete(`http://localhost:3000/deleteUser/${uid}`);
        console.log(response.data); // Handle success
    } catch (error) {
        console.error('Error deleting user:', error.response.data); // Handle error
    }
  };