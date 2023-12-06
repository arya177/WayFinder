import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const MapComponent = ({ center, groupMembers }) => {
  useEffect(() => {
    // Create a map instance with a specified center and zoom level
    const map = L.map('map').setView(center, 22);

    // Add a tile layer (you can use any tile provider)
    // L.tileLayer('/home/arya/Documents/projects/fyp/WayFinder/indowayfinder/src/images/marker.jpg').addTo(map);
    const imageUrl = '/home/arya/Documents/projects/fyp/WayFinder/indowayfinder/src/images/marker.jpg';
    // const imageBounds = [[0, 0], [10, 10]]; // Adjust the bounds as needed
    // L.imageOverlay(imageUrl, imageBounds).addTo(map);
    // Add markers for each group member
    // groupMembers.forEach((member) => {
    //   console.log(member)
    //   L.marker(member.location).addTo(map).bindPopup(member.name);
    // });
    const customMarkerIcon = L.icon({
      iconUrl: imageUrl,
      iconSize: [32, 32], // Adjust the size as needed
      iconAnchor: [16, 32], // Adjust the anchor point as needed
    });
    groupMembers.forEach((member) => {
      L.marker(member.location, { icon: customMarkerIcon }).addTo(map).bindPopup(member.name);
    });
    return () => {
      // Clean up when the component unmounts
      map.remove();
    };
  }, [center, groupMembers]);

  return <div id="map" style={{ height: '500px' }} />;
};

export default MapComponent;
