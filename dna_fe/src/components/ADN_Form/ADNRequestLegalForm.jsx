import React from 'react';
import { getAllLegalServices } from '../../api/serviceApi';
import useADNRequestForm from '../../hooks/useADNRequestForm';
import ADNRequestForm from './ADNRequestForm';

const ADNRequestLegalForm = () => {
  const {
    customer,
    sampleCount,
    isLoading,
    services,
    selectedService,
    setSelectedService,
    formData,
    error,
    success,
    handleSampleChange,
    handleInputChange,
    handleSubmit,
    calculateTotalPrice,
  } = useADNRequestForm(getAllLegalServices);

  return (
    <ADNRequestForm
      title="ĐƠN YÊU CẦU PHÂN TÍCH ADN HÀNH CHÍNH"
      fetchServices={getAllLegalServices}
      isCivil={false}
      customer={customer}
      sampleCount={sampleCount}
      isLoading={isLoading}
      services={services}
      selectedService={selectedService}
      setSelectedService={setSelectedService}
      formData={formData}
      error={error}
      success={success}
      handleSampleChange={handleSampleChange}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      calculateTotalPrice={calculateTotalPrice}
    />
  );
};

export default ADNRequestLegalForm;