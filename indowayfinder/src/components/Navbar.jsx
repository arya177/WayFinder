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
import { addUser,createGroup, joinGroup, getUserByUsername, updateUserByUsername } from '../api';
import { Snackbar } from '@mui/material';
import logoImage from '../images/logo1.jpeg'
import { useNavigate } from "react-router-dom";


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
  const [groupName, setGroupName] = useState('');
  const [joinGroupCode, setJoinGroupCode] = useState('');

  const navigate = useNavigate();
  const handleGroupNameChange = (event) => {
    // Update the state with the new group name when the TextField value changes
    setGroupName(event.target.value);
  };

  const handleJoinGroupCodeChange = (event) => {
    setJoinGroupCode(event.target.value);
  }
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      setUser(user);

      // Check if the user already exists in the database
      const existingUser = await getUserByUsername(user.displayName);
      const initialLocation = await getCurrentLocation();
      console.log(initialLocation);
      if (existingUser) {
        console.log('User already exists. Perform update.');
        // Perform update logic here
        const updatedUserData = {
          username: user.displayName,
          email: user.email,
          route_prefrence: 'shortest_route',
          groups: [],
          location: initialLocation
        };
        await updateUserByUsername(user.displayName, updatedUserData);
      } else {
        console.log('User does not exist. Perform add.');
        // Perform add logic here
        
        const user_details = {
          username: user.displayName,
          email: user.email,
          route_prefrence: 'shortest_route',
          groups: [],
          location: initialLocation
        };
        await addUser(user_details);

        // Start interval to update location every 1 minute
        setInterval(async () => {
          const newLocation = await getCurrentLocation();
          const updatedUserData = {
            location: newLocation
          };
          await updateUserByUsername(user.displayName, updatedUserData);
        }, 60000); // 1 minute interval
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get the user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
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

  const confirmCreateGroupDialog = () => {
    if(groupName === ''){
      alert("Please add group name")
      return
    }
    const group_details = {
      username: user.displayName,
      groupName: groupName,
      groupCode: newGroupID
    }
    createGroup(group_details);
    closeCreateGroupDialog()

  }

  const confirmJoinGroupDialog = () => {
    if(joinGroupCode === ''){
      alert("Please add you group code")
      return
    }
    const group_details = {
      username: user.displayName,
      groupCode: joinGroupCode
    }
    joinGroup(group_details);
    closeJoinGroupDialog();
  }
  const iconStyle = { color: 'red', fontSize: 40 };

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = () => {
    if (newGroupID) {
      navigator.clipboard.writeText(newGroupID)
        .then(() => {
          setCopySuccess(true);
        })
        .catch((err) => {
          console.error('Error copying to clipboard:', err);
        });
    }
  };
  const goToHome = () => {
    navigate('/')
  }

  return (
    <div className="navbar">
      <div className="ryt">
      <div className="menu-button" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <img src={logoImage} alt="Logo" className="logo" onClick={goToHome}/>
      <p className="logo-txt" onClick={goToHome}>IndoWayFinder</p>
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
          <TextField
                    id="group-name"
                    label="Group Name"
                    variant="outlined"
                    required
                    value={groupName}
                    onChange={handleGroupNameChange}
          />
            <div className="invite">
              <div className="invite-text">Invite members</div>
              <div className="invite-icon">
                <ContentCopyIcon style={{ fontSize: 25 }} onClick={handleCopyClick}/>
                {newGroupID ? (
    newGroupID
  ) : (
    <span style={{ color: 'gray' }}>Group Code</span>
  )}
              </div>
            </div>
            <Snackbar
              open={copySuccess}
              autoHideDuration={2000}
              onClose={() => setCopySuccess(false)}
              message="Group Code copied to clipboard!"
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={closeCreateGroupDialog}>Cancel</Button>
          <Button onClick={confirmCreateGroupDialog}>Create</Button>
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
            {/* <TextField id="group-code" label="Group Code" variant="outlined" required /> */}
            <TextField
                    id="group-code"
                    label="Group Code"
                    variant="outlined"
                    required
                    value={joinGroupCode}
                    onChange={handleJoinGroupCodeChange}
          />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={closeJoinGroupDialog}>Cancel</Button>
          <Button onClick={confirmJoinGroupDialog}>Join</Button>
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
