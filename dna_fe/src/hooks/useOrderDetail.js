import { useEffect, useState } from 'react';
import { getTestOrderById } from '../api/orderApi';
import { getServiceById, getAccountByCustomerId, getStaffById,getTestSamplesByOrderId } from '../api/accountApi';

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [service, setService] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [registrationStaff, setRegistrationStaff] = useState(null);
  const [testingStaff, setTestingStaff] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderData = await getTestOrderById(orderId);
        setOrder(orderData);

        const [serviceData, customerData, sampleList] = await Promise.all([
          getServiceById(orderData.serviceId),
          getAccountByCustomerId(orderData.customerId),
          getTestSamplesByOrderId(orderId)
        ]);

        setService(serviceData);
        setCustomer(customerData);
        setSamples(sampleList);

        if (orderData.registrationStaffId) {
          const regStaff = await getStaffById(orderData.registrationStaffId);
          setRegistrationStaff(regStaff);
        }

        if (orderData.testingStaffId) {
          const testStaff = await getStaffById(orderData.testingStaffId);
          setTestingStaff(testStaff);
        }

      } catch (err) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  return {
    order,
    service,
    customer,
    samples,
    registrationStaff,
    testingStaff,
    loading,
    error
  };
};
