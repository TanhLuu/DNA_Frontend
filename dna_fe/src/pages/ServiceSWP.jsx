import { useEffect, useState } from 'react';
import { getAllServices } from '../api/serviceApi';

const ServiceList = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const services = await getAllServices();
            setServices(services);
        };
        fetchServices();
    }, []);

    return (
        <div className="service-grid">
          {services.map((service) => (
            <div key={service.serviceID}>
              <h3 >{service.serviceName}</h3>
                <p >{service.describe || 'Không có mô tả chi tiết.'}</p>
              </div>
          ))}
     </div>    
    )
 };
  export default ServiceList ;