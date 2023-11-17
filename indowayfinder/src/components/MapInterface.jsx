import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import './MapInterface.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MapInterface = () => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    const locationIconStyle = {
        fontSize: '50px',
        color: 'green',
    };
    useEffect(() => {
        // Dummy list of group members with sample locations
        const dummyGroupMembers = [
          { id: 1, username: 'User1', location: [37.7749, -122.4194] },
          { id: 2, username: 'User2', location: [37.7522, -122.4437] },
          { id: 3, username: 'User3', location: [37.7781, -122.4298] },
        ];
    
        // Update the groupMembers state
        setGroupMembers(dummyGroupMembers);
    
        // Set the center based on the first group member's location, or use a default
        if (dummyGroupMembers.length > 0) {
          const firstMember = dummyGroupMembers[0];
          setCenter(firstMember.location);
        }
      }, []); // Adjust the dependencies based on your use case
    return(
        <>
          <div className="main">
            <div className="upper">
            <div className="location-icon"><LocationOnIcon style={locationIconStyle} /></div>
            <div className="rounded-edge"><input className="rounded-edge-textarea" type="text" placeholder="Start Location" /></div>
            </div>
            <MapComponent center={center} groupMembers={groupMembers} />
          </div>
        </>
    )
};

export default MapInterface;