const express = require('express');
const router = express.Router();

// Middleware to pass usersRef to the routes
router.use((req, res, next) => {
  req.usersRef = req.app.get('usersRef'); // Get usersRef from the app
  next();
});
// Define a route to add a new user
router.post('/addUser', (req, res) => {
  const userData = req.body; // Expecting a JSON object with user data
  const usersRef = req.usersRef; // Get usersRef from the request
  console.log("userData:", userData);
  console.log("usersRef:", usersRef);
  // Push the user data to the Firebase Realtime Database
  usersRef.push(userData, (error) => {
    if (error) {
      res.status(500).send("Error adding user: " + error.message);
    } else {
      res.status(200).send("User added successfully");
    }
  });
});

// Define a route to get user details by username
router.get('/getUserByUsername/:username', (req, res) => {
  const username = req.params.username; // Get the username from the request parameters
  const usersRef = req.usersRef; // Get usersRef from the request

  // Query the Firebase Realtime Database to find the user with the given username
  usersRef.orderByChild('username').equalTo(username).once("value", (snapshot) => {
    const user = snapshot.val();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Define a route to update user details by username
router.put('/updateUserByUsername/:username', (req, res) => {
  const username = req.params.username; // Get the username from the request parameters
  const updatedUserData = req.body; // Expecting a JSON object with updated user data
  const usersRef = req.usersRef; // Get usersRef from the request

  // Query the Firebase Realtime Database to find the user with the given username
  usersRef.orderByChild('username').equalTo(username).once("value", (snapshot) => {
    const user = snapshot.val();
    if (user) {
      // Update user data in the Firebase Realtime Database
      const uid = Object.keys(user)[0]; // Assuming the username is unique
      usersRef.child(uid).update(updatedUserData, (error) => {
        if (error) {
          res.status(500).send("Error updating user: " + error.message);
        } else {
          res.status(200).send("User updated successfully");
        }
      });
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Define a route to delete user by username
router.delete('/deleteUserByUsername/:username', (req, res) => {
  const username = req.params.username; // Get the username from the request parameters
  const usersRef = req.usersRef; // Get usersRef from the request

  // Query the Firebase Realtime Database to find the user with the given username
  usersRef.orderByChild('username').equalTo(username).once("value", (snapshot) => {
    const user = snapshot.val();
    if (user) {
      // Remove the user data from the Firebase Realtime Database
      const uid = Object.keys(user)[0]; // Assuming the username is unique
      usersRef.child(uid).remove((error) => {
        if (error) {
          res.status(500).send("Error deleting user: " + error.message);
        } else {
          res.status(200).send("User deleted successfully");
        }
      });
    } else {
      res.status(404).send("User not found");
    }
  });
});

module.exports = router;



