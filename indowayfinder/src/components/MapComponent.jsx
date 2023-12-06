
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const MapComponent = ({ center, groupMembers }) => {
  useEffect(() => {
    // Create a map instance with a specified center and zoom level
    const map = L.map('map').setView(center, 22);

    // Add a tile layer (you can use any tile provider)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add markers for each group member
    groupMembers.forEach((member) => {
      console.log(member)
      L.marker(member.location).addTo(map).bindPopup(member.name);
    });

    return () => {
      // Clean up when the component unmounts
      map.remove();
    };
  }, [center, groupMembers]);

  return <div id="map" style={{ height: '500px' }} />;
};

export default MapComponent;