import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import './MapInterface.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useUserContext } from '../UserContext';
import { getUserByUsername } from '../api'


const MapInterface = () => {
    const user = useUserContext();
    const [groupMembers, setGroupMembers] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    useEffect(() => {
      // Dummy list of group members with sample locations
      // console.log("hi")
      const dummyGroupMembers = [
        { id: 1, name: 'User1', location: [37.7749, -122.4194] }
      ];
      setGroupMembers(dummyGroupMembers);

  
      // Set the center based on the first group member's location, or use a default
      if (dummyGroupMembers.length > 0) {
        const firstMember = dummyGroupMembers[0];
        setCenter(firstMember.location);
      }
    }, []);
    const [userDetails, setUserDetails] = useState(null);
    // useEffect(() => {
    //                   if(user){
    //                   const userInfo = getUserByUsername(user?.displayName);
    //                   console.log(userInfo)
    //                   if(userInfo) setUserDetails(userInfo)
    //                   }
                      
    //                   setCenter([0,0]);
    //                 }, [user])
    
    const locationIconStyle = {
        fontSize: '50px',
        color: 'green',
    };
    
    const getUserDetails = async () => {
      
      if (user) {
        try {
          // console.log("hi")
          const userInfo = await getUserByUsername(user?.displayName);
          console.log(userInfo);
          const data = Object.values(userInfo)
          console.log(data[0]?.location, data, user?.displayName)
          if (userInfo) setUserDetails(userInfo);
          const userLocation = [{
            id: 1,
            name: user?.displayName,
            location: data[0]?.location
          }];
          setCenter(data[0]?.location)
          setGroupMembers(userLocation)
          console.log(userLocation)
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
  
      // setCenter([0, 0]);
    };
  
    useEffect(() => {
      getUserDetails();
    }, [user]);

      
    return(
        <>
          <div className="main">
            {/* <div className="upper">
            <div className="location-icon"><LocationOnIcon style={locationIconStyle} /></div>
            <div className="rounded-edge"><input className="rounded-edge-textarea" type="text" placeholder="Start Location" /></div>
            </div> */}
            <MapComponent center={center} groupMembers={groupMembers} />
          </div>
        </>
    )
};

export default MapInterface;