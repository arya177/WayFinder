import React, { useState, useEffect } from 'react';
import './MyGroups.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserContext } from '../UserContext';
import { getUserByUsername } from '../api';
import GroupMap from '../pages/GroupMap'; // Assuming the GroupMap component is in the same directory

const MyGroups = () => {
  const user = useUserContext();
  const [userDetails, setUserDetails] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groupMembers, setGroupMembers] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    
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
      }, []);
  const showGroupMap = (groupName) => {
    setSelectedGroup(groupName);
    setShowMap(true);
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsData = await getUserByUsername(user.displayName);
        console.log(userDetailsData);
        setUserDetails(userDetailsData);
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <>
      {!showMap && userDetails &&
        Object.values(userDetails).map((userData, index) => (
          <div key={index}>
            {userData.groups ? (
              userData.groups.map((groupName, groupIndex) => (
                <div key={groupIndex} className="my-group" onClick={() => showGroupMap(groupName)}>
                  <div className="my-group-text">{groupName}</div>
                  <div className="action">
                    <div className="action-text">Invite</div>
                    <div className="action-icon">
                      <DeleteIcon style={{ fontSize: 30 }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-group-text">You are not a part of any group.</p>
            )}
          </div>
        ))}

      {showMap && selectedGroup && (
        <GroupMap center={center} groupMembers={groupMembers} onClose={() => setShowMap(false) } />
      )}
    </>
  );
};

export default MyGroups;
