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

  // Push the user data to the Firebase Realtime Database
  usersRef.push(userData, (error) => {
    if (error) {
      res.status(500).send("Error adding user: " + error.message);
    } else {
      res.status(200).send("User added successfully");
    }
  });
});

// Define a route to get user details by UID
router.get('/getUser/:uid', (req, res) => {
  const uid = req.params.uid; // Get the UID from the request parameters
  const usersRef = req.usersRef; // Get usersRef from the request

  // Get user data from the Firebase Realtime Database
  usersRef.child(uid).once("value", (snapshot) => {
    const user = snapshot.val();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Define a route to update user details by UID
router.put('/updateUser/:uid', (req, res) => {
  const uid = req.params.uid; // Get the UID from the request parameters
  const updatedUserData = req.body; // Expecting a JSON object with updated user data
  const usersRef = req.usersRef; // Get usersRef from the request

  // Update user data in the Firebase Realtime Database
  usersRef.child(uid).update(updatedUserData, (error) => {
    if (error) {
      res.status(500).send("Error updating user: " + error.message);
    } else {
      res.status(200).send("User updated successfully");
    }
  });
});

// Define a route to delete user by UID
router.delete('/deleteUser/:uid', (req, res) => {
  const uid = req.params.uid; // Get the UID from the request parameters
  const usersRef = req.usersRef; // Get usersRef from the request

  // Remove the user data from the Firebase Realtime Database
  usersRef.child(uid).remove((error) => {
    if (error) {
      res.status(500).send("Error deleting user: " + error.message);
    } else {
      res.status(200).send("User deleted successfully");
    }
  });
});

module.exports = router;



