import axiosInstance from './axiosInstance';
import axios from 'axios';

// Mock data based on the data you provided
const MOCK_SERVICES = [
  {
    serviceID: 1,
    serviceName: "Xét nghiệm ADN cha - con",
    servicePurpose: "Xác định huyết thống cha con",
    timeTest: 48,
    serviceBlog: "https://dna.com/blog/cha-con",
    price: 1500000,
    numberOfSample: 2
  },
  {
    serviceID: 2,
    serviceName: "Xét nghiệm ADN anh - em",
    servicePurpose: "Xác định huyết thống anh em",
    timeTest: 48,
    serviceBlog: "https://dna.com/blog/anh-em",
    price: 1600000,
    numberOfSample: 2
  },
  {
    serviceID: 3,
    serviceName: "Xét nghiệm huyết thống",
    servicePurpose: "Nhận kết quả trong ngày",
    timeTest: 8,
    serviceBlog: "",
    price: 2000000,
    numberOfSample: 1
  }
];

// Function that tries the API first, falls back to mock data
export const getAllServices = async () => {
  try {
    // First try the actual API
    console.log("Attempting to fetch services from API...");
    const response = await axios.get('http://localhost:8080/api/services');
    console.log("API request successful!");
    return response.data;
  } catch (error) {
    console.warn("API request failed, using mock data instead:", error.message);
    
    // Return the mock data instead
    console.log("Returning mock services data");
    return MOCK_SERVICES;
  }
};

export const getServiceById = (id) => {
  return MOCK_SERVICES.find(service => service.serviceID === Number(id));
};
export const createService = async (serviceData) => {
  try {
    const response = await axiosInstance.post('/api/services', serviceData);
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await axiosInstance.put(`/api/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    await axiosInstance.delete(`/api/services/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    throw error;
  }
};