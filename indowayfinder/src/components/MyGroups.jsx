import React from "react";
import './MyGroups.css';
import DeleteIcon from '@mui/icons-material/Delete';

const MyGroups = () => {
    return (
        <>
            <div className="my-group">
                <div className="my-group-text">Saputara trip</div>
                <div className="action">
                    <div className="action-text">Invite</div>
                    <div className="action-icon"><DeleteIcon style={{ fontSize: 30 }} /></div>
                </div>
            </div>
            <div className="my-group">
                <div className="my-group-text">Udaipur trip</div>
                <div className="action">
                    <div className="action-text">Invite</div>
                    <div className="action-icon"><DeleteIcon style={{ fontSize: 30 }} /></div>
                </div>
            </div>            
            <div className="my-group">
                <div className="my-group-text">Mumbai trip</div>
                <div className="action">
                    <div className="action-text">Invite</div>
                    <div className="action-icon"><DeleteIcon style={{ fontSize: 30 }} /></div>
                </div>
            </div>
            <div className="my-group">
                <div className="my-group-text">Dang trip</div>
                <div className="action">
                    <div className="action-text">Invite</div>
                    <div className="action-icon"><DeleteIcon style={{ fontSize: 30 }} /></div>
                </div>
            </div>            
            <div className="my-group">
                <div className="my-group-text">Bharuch trip</div>
                <div className="action">
                    <div className="action-text">Invite</div>
                    <div className="action-icon"><DeleteIcon style={{ fontSize: 30 }} /></div>
                </div>
            </div>
        </>
    )
}

export default MyGroups;