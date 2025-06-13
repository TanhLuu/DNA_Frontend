import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Payment from '../../components/Shared/Payment'; // Updated import path

const CompletePayment = () => {
  const { orderId } = useParams();
  const [paymentData, setPaymentData] = useState({
    orderCode: '',
    amount: 0,
    customerName: '',
    isSuccess: true,
    isLoading: true
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch(`/api/payments/${orderId}`);
        const data = await response.json();
        
        setPaymentData({
          orderCode: data.orderCode,
          amount: data.amount,
          customerName: data.customerName,
          isSuccess: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setPaymentData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchPaymentData();
  }, [orderId]);

  return <Payment {...paymentData} />;
};

export default CompletePayment;