import React, { useState } from 'react';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
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
        <ul>
          <li>My Groups</li>
          <li>Create Group</li>
          <li>Join Group</li>
          <li>Settings</li>
        </ul>
        <div className="close-button" onClick={toggleMenu}>
          ✕
        </div>
      </div>
      <div className="emergency-button" onClick={toggleEmergency}>
        {isEmergencyActive ? (
          <AddAlarmIcon style={iconStyle} />
        ) : (
          <AlarmOffIcon style={iconStyle} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
