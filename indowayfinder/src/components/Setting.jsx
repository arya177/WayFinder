import React from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import './Setting.css';

const Setting = () => {
    return (
        <>
            <div className="user">
                <p className="user-username-text">username</p>
                <p className="user-username-value">arya123</p>
            </div>
            <div className="user">
                <p className="user-username-text">email id</p>
                <p className="user-username-value">aryashahi2002@gmail.com</p>
            </div>
            <div className="prefrence">
                <p className="user-username-text">route preference</p>
                <div className="radio">
                <FormControl >
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        
                        <FormControlLabel value="female" control={<Radio />} label="Shortest route" />
                        <FormControlLabel value="male" control={<Radio />} label="Stairs" />
                        <FormControlLabel value="other" control={<Radio />} label="Elevator" />
                    </RadioGroup>
                </FormControl>
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