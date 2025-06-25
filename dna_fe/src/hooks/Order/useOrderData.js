// hooks/useOrderData.js
import { useState, useEffect } from "react";
import {
  getTestOrderById,
  getTestSamplesByOrderId,
  getTestResultsByOrderId,
  getTestResultSamplesByOrderId,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
} from "../../api/customerOrderApi";
import { getStaffById, getAccountById } from "../../api/adminOrderApi";

export const useOrderData = (orderId) => {
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [service, setService] = useState(null);
  const [testSamples, setTestSamples] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [testResultSamples, setTestResultSamples] = useState([]);
  const [registrationStaff, setRegistrationStaff] = useState(null);
  const [testingStaff, setTestingStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const orderData = await getTestOrderById(orderId);
        setOrder(orderData);

        const accountInfo = await getAccountByCustomerId(orderData.customerId);
        const customerInfo = await getCustomerById(orderData.customerId);
        setAccount(accountInfo);
        setCustomer(customerInfo);

        const serviceInfo = await getServiceById(orderData.serviceId);
        setService(serviceInfo);

        if (orderData.registrationStaffId) {
          const regStaffInfo = await getStaffById(orderData.registrationStaffId);
          const regAccountInfo = await getAccountById(regStaffInfo.accountId);
          setRegistrationStaff(regAccountInfo);
        }
        if (orderData.testingStaffId) {
          const testStaffInfo = await getStaffById(orderData.testingStaffId);
          const testAccountInfo = await getAccountById(testStaffInfo.accountId);
          setTestingStaff(testAccountInfo);
        }

        const samples = await getTestSamplesByOrderId(orderData.orderId);
        setTestSamples(samples);

        const results = await getTestResultsByOrderId(orderId);
        setTestResults(results);

        const resultSamples = await getTestResultSamplesByOrderId(orderId);
        setTestResultSamples(resultSamples);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  return {
    order,
    setOrder,
    customer,
    account,
    service,
    testSamples,
    setTestSamples,
    testResults,
    testResultSamples,
    registrationStaff,
    testingStaff,
    loading,
    error,
  };
};