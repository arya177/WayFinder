import React, { useState, useRef } from 'react';
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
  const [isCamera, setIsCamera] = useState(false);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleSubmit(file);
  };

  const handleCameraClick = async () => {
    setIsCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCaptureClick = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.png');
      setSelectedFile(file);
      handleSubmit(file);
    }, 'image/png');
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
            <CameraAltIcon style={defaultIconStyle} onClick={handleCameraClick} />
            {isCamera && <button onClick={handleCaptureClick}>Capture</button>}
          </div>
          {isCamera && <div className="camera-icon">
            <video ref={videoRef} style={{ display: 'block' }} autoPlay muted />
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Footer;
