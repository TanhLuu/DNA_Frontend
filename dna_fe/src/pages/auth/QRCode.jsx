import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Payment from '../../components/Shared/Payment';

const QRCode = () => {
  const { orderId } = useParams();
  const [paymentData, setPaymentData] = useState({
    orderCode: '',
    amount: 0,
    qrImage: '',
    isLoading: true
  });

  useEffect(() => {
    // Temporary mock data until API is ready
    const mockData = {
      orderCode: orderId,
      amount: 10000000,
      qrImage: '/qr-sample.png',
      isLoading: false
    };

    setPaymentData(mockData);

    // Uncomment when API is ready
    // const fetchPaymentData = async () => {
    //   try {
    //     const response = await fetch(`/api/payments/qr/${orderId}`);
    //     const data = await response.json();
        
    //     setPaymentData({
    //       orderCode: data.orderCode,
    //       amount: data.amount,
    //       qrImage: data.qrImage,
    //       isLoading: false
    //     });
    //   } catch (error) {
    //     console.error('Error fetching payment data:', error);
    //     setPaymentData(prev => ({ ...prev, isLoading: false }));
    //   }
    // };

    // fetchPaymentData();
  }, [orderId]);

  return <Payment {...paymentData} />;
};

export default QRCode;