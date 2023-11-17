import React, { useState, useEffect } from 'react';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from '../firebase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isCreateGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [isJoinGroupDialogOpen, setJoinGroupDialogOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const [timer, setTimer] = useState(30);
  const [user, setUser] = useState(null);
  const [newGroupID, setNewGroupID] = useState(null)

  const openConfirmDialog = () => {
    // Placeholder function for opening the confirmation dialog
    // You need to implement this function based on your application logic
    console.log("Opening confirmation dialog");
  };
  const openTimerDialog = () => {
    setIsTimerDialogOpen(true);
  };

  const closeTimerDialog = () => {
    setIsTimerDialogOpen(false);
  };
  const handleConfirmation = () => {
    // Placeholder function for handling confirmation logic
    // You need to implement this function based on your application logic
    console.log("Handling confirmation logic");
  };


  const startTimer = () => {
    setTimer(30); // Reset the timer to 30 seconds before starting

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      closeTimerDialog();
      handleConfirmation(); // Handle confirmation logic when timer reaches 0
    }, 30000);
  };



  // User Authentication State


  const auth = getAuth(); // Get the Firebase Auth instance

  useEffect(() => {
    // Add a Firebase Authentication observer to check user status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleCreateGroup = () => {
    const generatedID = generateGroupID(); // You need to implement this function
    setNewGroupID(generatedID);
    console.log("New Group ID:", generatedID);
    // Close the dialog or perform other actions as needed
    closeCreateGroupDialog();
  };
  const generateGroupID = () => {
    // Implement your logic to generate a unique group ID
    // For example, you can use a combination of timestamp and random numbers
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomSuffix}`;
  };
  const signInWithGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(null);  // Clear the user state
        setIsProfileMenuOpen(false); // Close the profile menu after logout
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
  };

  const openCreateGroupDialog = () => {
    handleCreateGroup()
    setCreateGroupDialogOpen(true);
  };

  const closeCreateGroupDialog = () => {
    setCreateGroupDialogOpen(false);
  };

  const openJoinGroupDialog = () => {
    setJoinGroupDialogOpen(true);
  };

  const closeJoinGroupDialog = () => {
    setJoinGroupDialogOpen(false);
  };
  const openEmergencyDialog = () => {
    setIsEmergencyActive(true);
  };

  const closeEmergencyDialog = () => {
    setIsEmergencyActive(false);
    setSelectedEmergency(null);
  };

  const startEmergencyTimer = () => {
    closeEmergencyDialog();
    openTimerDialog();
    startTimer();
  };

  const openEmergencyOptionsDialog = () => {
    closeCreateGroupDialog();
    closeJoinGroupDialog();
    closeProfileMenu();
    openEmergencyDialog();
  };

  const selectEmergency = (emergencyType) => {
    setSelectedEmergency(emergencyType);
    closeEmergencyDialog();
    startEmergencyTimer();
  };

  const closeProfileMenu = () => {
    // Placeholder function for closing the profile menu
    setIsProfileMenuOpen(false);
  };

  const iconStyle = { color: 'red', fontSize: 40 };

  return (
    <div className="navbar">
      <div className="menu-button" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="side-nav">
          <div className="side-nav-text">Menu</div>
          <div className="close-button" onClick={toggleMenu}>
            ✕
          </div>
        </div>
        <ul>
          <li>
            <Link to="/mygroups" className="link">
              My Groups
            </Link>
          </li>
          <li>
            <div onClick={openCreateGroupDialog} className="create-group">
              Create Group
            </div>
          </li>
          <li>
            <div onClick={openJoinGroupDialog} className="join-group">
              Join Group
            </div>
          </li>
          <li>
            <Link to="/settings" className="link">
              Settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-right">
      {user ? (
        <div className="user-profile-container">
          <div className="user-profile" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <Avatar
              alt={user.displayName}
              src={user.photoURL}
            />
          </div>
          <Dialog open={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)}>
            <DialogTitle className="dialog-title">Profile</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL}
                  sx={{ width: 100, height: 100 }}
                />
                <h3>{user.displayName}</h3>
                <p>{user.email}</p>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={signOutUser}>Logout</Button>
              <Button onClick={() => setIsProfileMenuOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <Button
          className="login-button"
          onClick={signInWithGoogle}
          variant="outlined"
        >
          Login with Google
        </Button>
      )}
      <div className="emergency-button" onClick={toggleEmergency}>
        {isEmergencyActive ? (
          <AddAlarmIcon style={iconStyle} />
        ) : (
          <AlarmOffIcon style={iconStyle} />
        )}
      </div>
      
      </div>
      <Dialog open={isCreateGroupDialogOpen} onClose={closeCreateGroupDialog} fullWidth>
        <DialogTitle className="dialog-title">Create Group</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="group-name" label="Group Name" variant="outlined" required />
            <div className="invite">
              <div className="invite-text">Invite members</div>
              <div className="invite-icon">
                <ContentCopyIcon style={{ fontSize: 25 }} />
                {newGroupID ? (
    newGroupID
  ) : (
    <span style={{ color: 'gray' }}>Group Code</span>
  )}
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={closeCreateGroupDialog}>Cancel</Button>
          <Button onClick={closeCreateGroupDialog}>Create</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isJoinGroupDialogOpen} onClose={closeJoinGroupDialog} fullWidth>
        <DialogTitle className="dialog-title">Join Group</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="group-code" label="Group Code" variant="outlined" required />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={closeJoinGroupDialog}>Cancel</Button>
          <Button onClick={closeJoinGroupDialog}>Join</Button>
        </DialogActions>
      </Dialog>

      {/* Emergency Options Dialog */}
      <Dialog
        open={isEmergencyActive}
        onClose={closeEmergencyDialog}
        fullWidth
      >
        <DialogTitle className="dialog-title">Select Emergency Type</DialogTitle>
        <DialogContent>
          <Button onClick={() => selectEmergency('police')}>Police</Button>
          <Button onClick={() => selectEmergency('ambulance')}>Ambulance</Button>
          <Button onClick={() => selectEmergency('fire')}>Fire Brigade</Button>
          {/* Add more emergency options as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEmergencyDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Timer Dialog */}
      <Dialog open={isTimerDialogOpen} onClose={closeTimerDialog} fullWidth>
        <DialogTitle className="dialog-title">Emergency Countdown</DialogTitle>
        <DialogContent>
          <p>{`Time remaining: ${timer} seconds`}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmation} color="primary">
            Confirm
          </Button>
          <Button onClick={closeTimerDialog} color="secondary">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      
    </div>
  );
};

export default Navbar;
