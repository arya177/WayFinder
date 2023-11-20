// Import Axios library
import axios from 'axios';

// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:8000'; // Replace with your backend URL

// Function to add a new user
export const addUser = async (userData) => {
  try {
    console.log(userData)
    const response = await axios.post('/api/users/addUser', userData);
    console.log(response.data); // Log the server response
  } catch (error) {
    console.error('Error adding user:', error.response.data);
  }
};

// Function to get user details by username
export const getUserByUsername = async (username) => {
  try {
    const response = await axios.get(`/api/users/getUserByUsername/${username}`);
    console.log(response.data); // Log the user details
    return response.data
  } catch (error) {
    console.error('Error getting user:', error.response.data);
  }
};

// Function to update user details by username
export const updateUserByUsername = async (username, updatedUserData) => {
  try {
    const response = await axios.put(`/api/users/updateUserByUsername/${username}`, updatedUserData);
    console.log(response.data); // Log the server response
  } catch (error) {
    console.error('Error updating user:', error.response.data);
  }
};

// Function to delete user by username
export const deleteUserByUsername = async (username) => {
  try {
    const response = await axios.delete(`/api/users/deleteUserByUsername/${username}`);
    console.log(response.data); // Log the server response
  } catch (error) {
    console.error('Error deleting user:', error.response.data);
  }
};

export const createGroup = async (groupDetails) => {
  try {
    const response = await axios.post(`/api/users/createGroup/${groupDetails}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error in creating group:', error.response.data);
  }
}

export const joinGroup = async (groupDetails) => {
  try{
    const response = await axios.post(`/api/users/joinGroup/${groupDetails}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error in joining group:', error.response.data);
  }
}

