import React from "react";
import './MapInterface.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MapInterface = () => {
    const locationIconStyle = {
        fontSize: '50px',
        color: 'green',
    };
    return(
        <>
            <div className="upper">
            <div className="location-icon"><LocationOnIcon style={locationIconStyle} /></div>
            <div className="rounded-edge"><input className="rounded-edge-textarea" type="text" placeholder="Start Location" /></div>
            </div>
        </>
    )
};

export default MapInterface;