import React, { useState, useEffect } from 'react';
import './SearchResults.css'; // Import your CSS file for styling
import { getImageDetails,runPythonCode } from '../api';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SearchResult = () => {
  const location = useLocation();
  const response = location.state?.response;

  useEffect(() => {
    console.log(response);
  }, [response]);


 
  const submitData = (x,y) => {
    console.log(x,y);
      runPythonCode(x,y);
  }

  const [imageList, setImagelist] = useState([
    {
      similarity: '0.23',
      imageUrl: '/home/arya/Documents/projects/fyp/WayFinder/indowayfinder/src/images/marker.jpg',
    },
    {
      similarity: '0.56',
      imageUrl: 'static/img/11.png',
    },
    {
      similarity: '1.345',
      imageUrl: 'static/img/8.png',
    },
    {
      similarity: '2.345',
      imageUrl: 'static/img/5.png',
    },
  ]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (imageList) {
          const fetchedDataList = await Promise.all(imageList.map(async (item) => {
            const match = item.imageUrl.match(/(\d+)/);
            const extractedNumber = match ? match[0] : null;
            const dataImage = await getImageDetails(extractedNumber);
    
            return dataImage;
          }));
          const filteredDataList = fetchedDataList.filter((data) => data !== null);
          const combinedDataList = imageList.map((item, index) => ({
            ...item,
            data: filteredDataList[index],
          }));
          console.log(combinedDataList)
          setDataList(combinedDataList);
        }
      } catch (error) {
        console.error('Error fetching group members location:', error);
      }
    };
    fetchData();
  }, [imageList]); // Add dependencies as needed 
  // const imageList = [
  //   {
  //     id: 1,
  //     name: 'Image 1',
  //     description: 'Description for Image 1',
  //     imageUrl: 'url_for_image_1.jpg',
  //   },
  //   {
  //       id: 1,
  //       name: 'Image 1',
  //       description: 'Description for Image 1',
  //       imageUrl: 'url_for_image_1.jpg',
  //     },
  //     {
  //       id: 1,
  //       name: 'Image 1',
  //       description: 'Description for Image 1',
  //       imageUrl: 'url_for_image_1.jpg',
  //     },
  //     {
  //       id: 1,
  //       name: 'Image 1',
  //       description: 'Description for Image 1',
  //       imageUrl: 'url_for_image_1.jpg',
  //     },

  //   // Add more image data as needed
  // ];
  return (
    <div className="image-grid">
      {dataList.map((image, index) => (
        <div className="image-item" key={image.imageUrl}>
          <img
            src='/home/arya/Documents/projects/fyp/WayFinder/indowayfinder/src/images/marker.jpg'
            alt={image.data?.data?.name} // Add optional chaining here
          />
          <div className="image-details">
            <p>{image.data?.name}</p>
            <p>{image.data?.data?.Desc}</p>
            <p>{image.similarity}</p>
            <p>{image.data?.data?.X}</p>
            <p>{image.data?.data?.Y}</p>
            <button onClick={() => submitData(image.data?.data?.X, image.data?.data?.Y)}>
              Get Direction
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
