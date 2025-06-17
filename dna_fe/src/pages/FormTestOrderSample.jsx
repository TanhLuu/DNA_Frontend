import React, { useState } from 'react';
import { createTestOrder, createTestSample } from '../api/orderSampleApi';

const OrderAndSampleForm = () => {
  const [order, setOrder] = useState({
    orderDate: '',
    sampleType: '',
    resultDeliveryMethod: '',
    resultDeliverAddress: '',
    sampleQuantity: '',
    amount: '',
  });

  const [sample, setSample] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    documentType: '',
    documentNumber: '',
    dateOfIssue: '',
    expirationDate: '',
    placeOfIssue: '',
    nationality: '',
    address: '',
    sampleType: '',
    numberOfSample: '',
    relationship: '',
    medicalHistory: '',
    fingerprint: '',
  });

  const handleOrderChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSampleChange = (e) => {
    setSample({ ...sample, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API tạo đơn test order trước
      const createdOrder = await createTestOrder(order);
      const orderId = createdOrder.orderId;

      // Gọi API tạo sample và gắn orderId vừa tạo
      await createTestSample({
        ...sample,
        orderId,
      });

      alert('Order and Sample created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create order/sample.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Test Order Information</h2>
      <input type="date" name="orderDate" onChange={handleOrderChange} />
      <input type="text" name="sampleType" placeholder="Sample Type" onChange={handleOrderChange} />
      <input type="text" name="resultDeliveryMethod" placeholder="Delivery Method" onChange={handleOrderChange} />
      <input type="text" name="resultDeliverAddress" placeholder="Delivery Address" onChange={handleOrderChange} />
      <input type="number" name="sampleQuantity" placeholder="Sample Quantity" onChange={handleOrderChange} />
      <input type="number" name="amount" placeholder="Amount" onChange={handleOrderChange} />

      <h2>Test Sample Information</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleSampleChange} />
      <input type="text" name="gender" placeholder="Gender" onChange={handleSampleChange} />
      <input type="date" name="dateOfBirth" onChange={handleSampleChange} />
      <input type="text" name="documentType" placeholder="Document Type" onChange={handleSampleChange} />
      <input type="text" name="documentNumber" placeholder="Document Number" onChange={handleSampleChange} />
      <input type="date" name="dateOfIssue" onChange={handleSampleChange} />
      <input type="date" name="expirationDate" onChange={handleSampleChange} />
      <input type="text" name="placeOfIssue" placeholder="Place of Issue" onChange={handleSampleChange} />
      <input type="text" name="nationality" placeholder="Nationality" onChange={handleSampleChange} />
      <input type="text" name="address" placeholder="Address" onChange={handleSampleChange} />
      <input type="text" name="sampleType" placeholder="Sample Type" onChange={handleSampleChange} />
      <input type="number" name="numberOfSample" placeholder="Number of Sample" onChange={handleSampleChange} />
      <input type="text" name="relationship" placeholder="Relationship" onChange={handleSampleChange} />
      <input type="text" name="medicalHistory" placeholder="Medical History" onChange={handleSampleChange} />
      <input type="text" name="fingerprint" placeholder="Fingerprint (base64 or string)" onChange={handleSampleChange} />

      <button type="submit">Create Test Order & Sample</button>
    </form>
  );
};

export default OrderAndSampleForm;
