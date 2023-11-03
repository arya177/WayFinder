import React, { useState } from 'react';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isCreateGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [isJoinGroupDialogOpen, setJoinGroupDialogOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
  };

  const openCreateGroupDialog = () => {
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

  const iconStyle = { color: 'red', fontSize: 35 }; // Adjust the fontSize as needed

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
            <Link to="/mygroups" className="link">My Groups</Link>
          </li>
          <li>
            <div onClick={openCreateGroupDialog} className="create-group">Create Group</div>
          </li>
          <li>
            <div onClick={openJoinGroupDialog} className="join-group">Join Group</div>
          </li>
          <li>
            <Link to="/settings" className="link">Settings</Link>
          </li>
        </ul>
      </div>
      <div className="emergency-button" onClick={toggleEmergency}>
        {isEmergencyActive ? (
          <AddAlarmIcon style={iconStyle} />
        ) : (
          <AlarmOffIcon style={iconStyle} />
        )}
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
            <div className='invite'>
              <div className="invite-text">Invite members</div>
              <div className="invite-icon">
                <ContentCopyIcon style={{ fontSize: 25 }} />
                #fff03c
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
    </div>
  );
};

export default Navbar;
