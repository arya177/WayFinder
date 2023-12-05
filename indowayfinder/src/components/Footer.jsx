import React, { useState } from 'react';
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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleSubmit(file);
  };

  const handleSubmit = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Image uploaded successfully!');
          // Add any additional handling or state updates as needed
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error during image upload:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="footer">
      <div className="upper">
        <div className="location-icon"><LocationOnIcon style={locationIconStyle} /></div>
        <div className="rounded-edge">
          <input
            className="rounded-edge-textarea"
            type="text"
            placeholder="Enter Destination"
          />
        </div>
      </div>
      <div className="divider-line"></div>
      <div className="lower">
        <div className="left-part">
          <div className="folder-icon">
            <label htmlFor="fileInput">
              <CreateNewFolderIcon style={defaultIconStyle} />
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        </div>
        <div className="divider-line-vertical"></div>
        <div className="right-part">
          <div className="camera-icon">
            {/* <button onClick={handleSubmit}> */}
            <CameraAltIcon style={defaultIconStyle} />
            {/* </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
