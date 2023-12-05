import React, { useState, useEffect } from 'react';
import './MyGroups.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserContext } from '../UserContext';
import { getUserByUsername } from '../api';
import GroupMap from '../pages/GroupMap'; // Assuming the GroupMap component is in the same directory
import { getGroupMembersLocation, getGroupNamebyID } from '../api';

const MyGroups = () => {
  const user = useUserContext();
  const [userDetails, setUserDetails] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groupMembers, setGroupMembers] = useState([]);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedGroup) {
          console.log("Selected Group", selectedGroup);
          const dummyGroupMembers = await getGroupMembersLocation(selectedGroup);
          setGroupMembers(dummyGroupMembers);

          if (dummyGroupMembers.length > 0) {
            const firstMember = dummyGroupMembers[0];
            setCenter(firstMember.location);
          }
        }
      } catch (error) {
        console.error('Error fetching group members location:', error);
      }
    };
    fetchData();
  }, [selectedGroup]); // Add dependencies as needed

  const showGroupMap = (groupName) => {
    setSelectedGroup(groupName);
    setShowMap(true);
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsData = await getUserByUsername(user.displayName);

        if (userDetailsData) {
          const promises = Object.entries(userDetailsData).map(async ([key, userData]) => {
            if (userData.groups) {
              const updatedGroups = await Promise.all(userData.groups.map(async (group, index) => {
                const groupName = await getGroupNamebyID(group);
                return {
                  groupName: groupName.groupName,
                  id: group
                };
              }));

              userDetailsData[key].groups = updatedGroups;
            }
          });

          await Promise.all(promises);

          console.log(userDetailsData)
          // const data = Object.values(userDetailsData.location);
          // console.log(data);
          setUserDetails(userDetailsData);
          // setCenter(userDetailsData.location);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    };


    fetchUserDetails();
  }, [user]);

  // useEffect(() => {
  //   console.log(userDetails);
  //   console.log(userDetails?.loction)
  //   setCenter(userDetails?.location)
  // }, [userDetails])
  return (
    <>
      {!showMap && userDetails &&
        Object.values(userDetails).map((userData, index) => (
          <div key={index}>
            {userData.groups ? (
              userData.groups.map((groupName, groupIndex) => (
                <div key={groupIndex} className="my-group" onClick={() => showGroupMap(groupName.groupName)}>
                  <div className="my-group-text">{ groupName.groupName}</div>
                  <div className="action">
                    <div className="action-text">Invite Id : {groupName.id}</div>
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
        <GroupMap center={center} groupMembers={groupMembers} onClose={() => setShowMap(false)} />
      )}
    </>
  );
};

export default MyGroups;
