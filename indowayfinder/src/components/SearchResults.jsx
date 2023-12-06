import React, { useState, useEffect } from 'react';
import './SearchResults.css'; // Import your CSS file for styling
import { getImageDetails, runPythonCode } from '../api';
import { useLocation } from 'react-router-dom';
import imageData from "../components/imagestore"

const SearchResult = () => {

  const [imageList, setImagelist] = useState([]);
  const [dataList, setDataList] = useState([]);
  const location = useLocation();
  const response = location.state?.response;

  useEffect(() => {
    setImagelist(response);
  }, [response]);

  const submitData = (x, y) => {
    console.log(x, y);
    runPythonCode(x, y);
  }

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
          setDataList(combinedDataList);
        }
      } catch (error) {
        console.error('Error fetching group members location:', error);
      }
    };
    fetchData();
  }, [imageList]);
  const [img, setImg] = useState([]);
  useEffect (() => {
    let data = [];
    const constructImageUrls = () => {
      const urls = dataList.forEach((image) => {
        const filenameWithoutExtension = image.imageUrl.split('/').pop().split('.')[0];
        console.log(img);
        data =[...data,imageData[filenameWithoutExtension]]
      });
      setImg(data)
    };
    constructImageUrls();
  },[dataList])
  
  return (
    <div className="image-grid">
      {dataList?.map((image, index) => (
        <div className="image-item" key={image.imageUrl}>
          <img
            src={img[index]}
            alt={image.data?.data?.name}
            style={{ height: '400px', width: '400px' }}
          />
          <div className="image-details">
            <p>{image.data?.data?.name}</p>
            <p>{image.data?.data?.Desc}</p>
            <p>{image.similarity}</p>
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
