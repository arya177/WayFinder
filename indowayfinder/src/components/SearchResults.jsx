import React from 'react';
import './SearchResults.css'; // Import your CSS file for styling

const SearchResult = () => {
  // Sample image data, replace it with your actual data
  const imageList = [
    {
      id: 1,
      name: 'Image 1',
      description: 'Description for Image 1',
      imageUrl: 'url_for_image_1.jpg',
    },
    {
        id: 1,
        name: 'Image 1',
        description: 'Description for Image 1',
        imageUrl: 'url_for_image_1.jpg',
      },
      {
        id: 1,
        name: 'Image 1',
        description: 'Description for Image 1',
        imageUrl: 'url_for_image_1.jpg',
      },
      {
        id: 1,
        name: 'Image 1',
        description: 'Description for Image 1',
        imageUrl: 'url_for_image_1.jpg',
      },
      
    // Add more image data as needed
  ];

  return (
    <div className="image-grid">
      {imageList.map((image, index) => (
        <div className="image-item" key={image.id}>
          <img src={image.imageUrl} alt={image.name} />
          <div className="image-details">
            <h3>{image.name}</h3>
            <p>{image.description}</p>
            <button>Get Direction</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
