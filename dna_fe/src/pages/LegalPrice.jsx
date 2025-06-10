import React, { useState, useEffect } from 'react';
import PriceTable from '../components/Shared/PriceTable';

const LegalPrice = () => {
  const [legalPriceData, setLegalPriceData] = useState({
    title: "BẢNG GIÁ XÉT NGHIỆM ADN HÀNH CHÍNH PHÁP LÝ",
    items: []
  });

  useEffect(() => {
    // TODO: Fetch data from API
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint');
    //     const data = await response.json();
    //     setLegalPriceData(data);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
    // fetchData();
  }, []);

  return <PriceTable {...legalPriceData} />;
};

export default LegalPrice;