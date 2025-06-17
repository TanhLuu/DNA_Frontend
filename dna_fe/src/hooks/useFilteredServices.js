import { useEffect, useState } from 'react';

const useFilteredServices = (fetchServiceApi) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchServiceApi();
        setServices(result);
        setFilteredServices(result);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      }
    };
    fetchData();
  }, [fetchServiceApi]);

  useEffect(() => {
    let result = [...services];
    if (searchTerm.trim()) {
      result = result.filter(service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === 'name') {
      result.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    } else if (sortOption === 'timeTest') {
      result.sort((a, b) => a.timeTest - b.timeTest);
    }

    setFilteredServices(result);
  }, [searchTerm, sortOption, services]);

  return {
    filteredServices,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  };
};

export default useFilteredServices;
