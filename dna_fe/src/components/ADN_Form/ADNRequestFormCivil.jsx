import React from 'react';
import { getAllCivilServices } from '../../api/serviceApi';
import useADNRequestForm from '../../hooks/useADNRequestForm';
import ADNRequestForm from './ADNRequestForm';

const ADNRequestCivilForm = () => {
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
  } = useADNRequestForm(getAllCivilServices);

  return (
    <ADNRequestForm
      title="ĐƠN YÊU CẦU PHÂN TÍCH ADN DÂN SỰ"
      fetchServices={getAllCivilServices}
      isCivil={true}
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

export default ADNRequestCivilForm;