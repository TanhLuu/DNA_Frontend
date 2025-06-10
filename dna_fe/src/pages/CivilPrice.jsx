import React, { useState, useEffect } from 'react';
import PriceTable from '../components/Shared/PriceTable';

const CivilPrice = () => {
  const [civilPriceData, setCivilPriceData] = useState({
    title: "BẢNG GIÁ XÉT NGHIỆM ADN DÂN SỰ",
    items: []
  });

  useEffect(() => {
    // TODO: Fetch data from API
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint');
    //     const data = await response.json();
    //     setCivilPriceData(data);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
    // fetchData();
  }, []);

  return <PriceTable {...civilPriceData} />;
};

export default CivilPrice;