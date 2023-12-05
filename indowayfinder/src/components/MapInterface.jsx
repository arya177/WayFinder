import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import './MapInterface.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useUserContext } from '../UserContext';
import { getUserByUsername } from '../api'


const MapInterface = () => {
    const user = useUserContext();
    // const [userDetails, setUserDetails] = useState(null);
    // useEffect(() => {
    //                   const userInfo = getUserByUsername(user?.displayName);
    //                   if(userInfo) setUserDetails(userInfo)
                      
                      
    //                 }, [user])
    const [groupMembers, setGroupMembers] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    const locationIconStyle = {
        fontSize: '50px',
        color: 'green',
    };
    useEffect(() => {
        // Dummy list of group members with sample locations
        const dummyGroupMembers = [
          { id: 1, username: 'User1', location: [37.7749, -122.4194] }
        ];
    
        // Update the groupMembers state
        // console.log(userDetails)
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