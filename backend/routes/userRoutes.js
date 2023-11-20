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

router.get('/getGroupNamebyID/:GroupID', (req, res) => {
  const GroupID = req.params.GroupID;

  req.app.get('db').ref('groups').child(GroupID ).once('value', (snapshot) => {
    const group = snapshot.val();

    if (group) {
      // Group found, send its name in the response
      res.status(200).json({ groupName: group.name });
    } else {
      // Group not found
      res.status(404).json({ error: 'Group not found' });
    }
  }, (error) => {
    // Handle any errors that may occur during the database query
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

router.post('/createGroup', (req, res) => {
  const username = req.body.username;
  const groupName = req.body.groupName;
  const groupId = req.body.groupCode;
  // Fetch the user ID based on the username
  req.app.get('usersRef').orderByChild('username').equalTo(username).once('value', (userSnapshot) => {
    const user = userSnapshot.val();
    if (user) {
      const userId = Object.keys(user)[0]; // Assuming there's only one user with the provided username
      // Continue with the rest of the code using the fetched userId
      const groupData = {
        name: groupName,
        members: {
          [userId]: true // Add the group creator as a member
        }
      };
      // Get the ID of the newly created group
      const newGroupRef = req.app.get('db').ref('groups').child(groupId);
      newGroupRef.set(groupData);

      // Update the user's groups in the database
      req.app.get('usersRef').child(userId).child('groups').transaction((currentGroups) => {
        return (currentGroups || []).concat(groupId);
      }, (error, committed) => {
        if (error) {
          res.status(500).send("Error updating user groups");
        } else if (committed) {
          res.status(200).json({ message: "Group created successfully", groupId });
        } else {
          res.status(500).send("Failed to update user groups");
        }
      });
    } else {
      res.status(404).send("User not found for the provided username");
    }
  });
});

router.post('/joinGroup', (req, res) => {
  const username = req.body.username;
  const groupCode = req.body.groupCode;

  // Fetch the user ID based on the username
  req.app.get('usersRef').orderByChild('username').equalTo(username).once('value', (userSnapshot) => {
    const users = userSnapshot.val();

    if (users) {
      const userId = Object.keys(users)[0]; // Assuming there's only one user with the provided username
      const user = users[userId];

      // Check if the user is already a member of the group
      if (!user.groups || !user.groups.includes(groupCode)) {
        // Check if the group with the provided code exists
        req.app.get('db').ref('groups').child(groupCode).once('value', (groupSnapshot) => {
          const group = groupSnapshot.val();

          if (group) {
            // Add the groupCode to the user's array of groups
            const updatedGroups = (user.groups || []).concat(groupCode);

            // Update the user's groups in the database
            req.app.get('usersRef').child(userId).child('groups').transaction((currentGroups) => {
              return (currentGroups || []).concat(groupCode);
            }, (error, committed) => {
              if (error) {
                res.status(500).json({ error: "Error updating user groups", message: error.message });
              } else if (committed) {
                // Add the user as a member to the group in the 'groups' collection
                req.app.get('db').ref('groups').child(groupCode).child('members').update({ [userId]: true });

                res.status(200).json({ message: "User joined the group successfully", groupCode });
              } else {
                res.status(500).json({ error: "Failed to update user groups", message: "Transaction not committed" });
              }
            });
          } else {
            res.status(404).json({ error: "Group not found", message: "Group not found with the provided code" });
          }
        });
      } else {
        res.status(200).json({ message: "User is already a member of the group" });
      }
    } else {
      res.status(404).json({ error: "User not found", message: "User not found for the provided username" });
    }
  });
});

router.delete('/deleteGroup', (req, res) => {
  const username = req.body.username;
  const groupId = req.body.groupId;

  // Fetch the user ID based on the username
  req.app.get('usersRef').orderByChild('username').equalTo(username).once('value', (userSnapshot) => {
    const users = userSnapshot.val();

    if (users) {
      const userId = Object.keys(user)[0]; // Assuming there's only one user with the provided username
      const user = users[userId];
      // Check if the user is a member of the group
      if (user.groups && user.groups.includes(groupId)) {
        // Remove the group from the user's list of groups
        req.app.get('usersRef').child(userId).child('groups').transaction((currentGroups) => {
          return (currentGroups || []).filter(group => group !== groupId);
        }, (error, committed) => {
          if (error) {
            res.status(500).json({ error: "Error updating user groups", message: error.message });
          } else if (committed) {
            // Update the user's membership status to false in the 'groups' collection
            req.app.get('db').ref('groups').child(groupId).child('members').update({ [userId]: false });

            res.status(200).json({ message: "User removed from the group successfully", groupId });
          } else {
            res.status(500).json({ error: "Failed to update user groups", message: "Transaction not committed" });
          }
        });
      } else {
        res.status(404).json({ error: "User is not a member of the group", message: "User is not a member of the specified group" });
      }
    } else {
      res.status(404).json({ error: "User not found for the provided username", message: "User not found for the specified username" });
    }
  });
});

router.get('/getGroupMembersLocation/:groupId', (req, res) => {
  const groupId = req.params.groupId;

  // Fetch the members of the group from the 'groups' collection
  req.app.get('db').ref('groups').child(groupId).child('members').once('value', (membersSnapshot) => {
    const members = membersSnapshot.val();

    if (members) {
      // Get an array of user IDs and their status from the 'members' node
      const memberData = Object.entries(members);

      // Filter out users whose status is true
      const activeMembers = memberData.filter(([userId, status]) => status === true);

      // Fetch the location of each active user from the 'users' collection
      const usersPromises = activeMembers.map(([userId]) => {
        return req.app.get('usersRef').child(userId).once('value')
          .then(userSnapshot => ({ userId, location: userSnapshot.val().location }));
      });

      // Wait for all user location fetch promises to resolve
      Promise.all(usersPromises)
        .then(usersLocations => {
          // usersLocations is an array of objects with userId and location properties
          res.status(200).json(usersLocations);
        })
        .catch(error => {
          res.status(500).json({ error: "Error fetching user locations", message: error.message });
        });
    } else {
      res.status(404).json({ error: "Group not found", message: "Group not found with the provided ID" });
    }
  });
});

router.post('/getGroupMembersLocation', (req, res) => {
  const groupName = req.body.groupName;
  if (!groupName) {
    return res.status(400).json({ error: "Bad Request", message: "groupName is required in the request body" });
  }

  // Query the 'groups' collection to find the group with the specified name
  req.app.get('db').ref('groups').orderByChild('name').equalTo(groupName).once('value', (groupSnapshot) => {
    const group = groupSnapshot.val();

    if (group) {
      // Extract the group ID from the snapshot
      const groupId = Object.keys(group)[0];

      // Fetch the members of the group from the 'members' node
      req.app.get('db').ref('groups').child(groupId).child('members').once('value', (membersSnapshot) => {
        const members = membersSnapshot.val();
        console.log(members);
        if (members) {
          // Get an array of user IDs and their status from the 'members' node
          const memberData = Object.entries(members);

          // Filter out users whose status is true
          const activeMembers = memberData.filter(([userId, status]) => status === true);

          // Fetch the location of each active user from the 'users' collection
          const usersPromises = activeMembers.map(([userId]) => {
            return req.app.get('usersRef').child(userId).once('value')
              .then(userSnapshot => ({ userId, name: userSnapshot.val().username,location: userSnapshot.val().location }));
          });

          // Wait for all user location fetch promises to resolve
          Promise.all(usersPromises)
            .then(usersLocations => {
              // usersLocations is an array of objects with userId and location properties
              res.status(200).json(usersLocations);
            })
            .catch(error => {
              console.error("Error fetching user locations:", error);
              res.status(500).json({ error: "Error fetching user locations", message: error.message });
            });
        } else {
          res.status(404).json({ error: "Group members not found", message: "Group members not found for the provided group name" });
        }
      });
    } else {
      res.status(404).json({ error: "Group not found", message: "Group not found with the provided name" });
    }
  });
});


module.exports = router;



