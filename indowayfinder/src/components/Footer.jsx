import React from 'react';
import './Footer.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const Footer = () => {
  const locationIconStyle = {
    fontSize: '50px',
    color: 'red',
  };

  const defaultIconStyle = {
    fontSize: '40px',
    color: 'black',
  };

  return (
    <div className="footer">
      <div className="upper">
        <div className="location-icon"><LocationOnIcon style={locationIconStyle} /></div>
        <div className="rounded-edge"><input className="rounded-edge-textarea" type="text" placeholder="Enter Destination" /></div>
      </div>
      <div className="divider-line"></div>
      <div className="lower">
        <div className="left-part">
          <div className="folder-icon">
            <CreateNewFolderIcon style={defaultIconStyle} />
          </div>
        </div>
        <div className="divider-line-vertical"></div>
        <div className="right-part">
          <div className="camera-icon">
            <CameraAltIcon style={defaultIconStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
