import React, { useState, useEffect } from 'react';
import './SearchResults.css'; // Import your CSS file for styling
import { getImageDetails,runPythonCode } from '../api';
import { useLocation } from 'react-router-dom';
import image1 from '../img/1.jpg';
import image2 from '../img/2.jpg';
import image3 from '../img/3.jpg';
import image4 from '../img/4.jpg';
import image5 from '../img/5.jpg';
import image6 from '../img/6.jpg';
import image7 from '../img/7.jpg';
import image8 from '../img/8.jpg';
import image9 from '../img/9.jpg';
import image10 from '../img/10.jpg';
import image11 from '../img/11.jpg';
import image12 from '../img/12.jpg';
import image13 from '../img/13.jpg';
import image14 from '../img/14.jpg';
import image15 from '../img/15.jpg';
import image16 from '../img/16.jpg';
import image17 from '../img/17.jpg';
import image18 from '../img/18.jpg';
import image19 from '../img/19.jpg';
import image20 from '../img/20.jpg';
import image21 from '../img/21.jpg';
import image22 from '../img/22.jpg';
import image23 from '../img/23.jpg';
import image24 from '../img/24.jpg';
import image25 from '../img/25.jpg';
import image26 from '../img/26.jpg';
import image27 from '../img/27.jpg';
import image28 from '../img/28.jpg';
import image29 from '../img/29.jpg';
import image30 from '../img/30.jpg';
import image31 from '../img/31.jpg';
import image32 from '../img/32.jpg';
import image33 from '../img/33.jpg';
import image34 from '../img/34.jpg';
import image35 from '../img/35.jpg';
import image36 from '../img/36.jpg';
import image37 from '../img/37.jpg';
import image38 from '../img/38.jpg';
import image39 from '../img/39.jpg';
import image40 from '../img/40.jpg';
import image41 from '../img/41.jpg';
import image42 from '../img/42.jpg';

const SearchResult = () => {

  const [imageList, setImagelist] = useState([]);
  const [dataList, setDataList] = useState([]);
  const location = useLocation();
  const response = location.state?.response;

  useEffect(() => {
    setImagelist(response);
  }, [response]);
 
  const submitData = (x,y) => {
    console.log(x,y);
      runPythonCode(x,y);
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

  return (
    <div className="image-grid">
      {dataList.map((image, index) => (
        <div className="image-item" key={image.imageUrl}>
          <img
            src={image3}
            alt={image.data?.data?.name}
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
