import React, { useEffect, useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import './Setting.css';
import { useUserContext } from '../UserContext';
import Button from '@mui/material/Button';
import { getUserByUsername, updateUserByUsername } from '../api'

const Setting = () => {
    const user = useUserContext();
    const [routePreference, setRoutePreference] = useState("shortest_route");
    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {setUserDetails(getUserByUsername(user.displayName))}, [user])

    const handleSaveChanges = () => {
        console.log(routePreference);
        const user_details = {
            username: user.displayName,
            email: user.email,
            route_prefrence: routePreference,
            groups: userDetails.groups,
            location: userDetails.location
        }
        updateUserByUsername(user.displayName, user_details);
    }
    return (
        <>
            <div className="user">
                <p className="user-username-text">username</p>
                <p className="user-username-value">{user.displayName}</p>
            </div>
            <div className="user">
                <p className="user-username-text">email id</p>
                <p className="user-username-value">{user.email}</p>
            </div>
            <div className="prefrence">
                <div>
                <p className="user-username-text">route preference</p>
                <div className="radio">
                <FormControl >
                    <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={routePreference}
                    onChange={(e) => setRoutePreference(e.target.value)}
                    name="radio-buttons-group"
                    >
                        <FormControlLabel value="shortest_route" control={<Radio />} label="Shortest route" />
                        <FormControlLabel value="stairs" control={<Radio />} label="Stairs" />
                        <FormControlLabel value="elevator" control={<Radio />} label="Elevator" />
                    </RadioGroup>
                </FormControl>
                </div>
                </div>
                <div className="save-btn">
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </div>
            </div>
            <div className="user">
                <p className="user-username-text">Delete account</p>
                <div className="user-username-value"><DeleteIcon style={{ fontSize: 35, color: "grey" }}/></div>
            </div>
        </>
    )
} 

export default Setting;