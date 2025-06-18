import React, { useEffect, useState } from "react";
import { getCustomerByAccountId } from '../api/accountApi'; 
import { fetchAccountInfo } from '../api/accountApi';
import { getAllServices } from '../api/serviceApi';
import axiosInstance from '../api/axiosInstance';
import '../styles/tuthu&guimau.css';

function TuThuGuiMau({ orderId }) {
    const [accountData, setAccountData] = useState(null);
    const [customer, setCustomer] = useState({});
    const [testOrder, setTestOrder] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [kitInfo, setKitInfo] = useState({
        serviceId: "",
        tenBoKit: "",
        maBoKit: "",
        tenKhachHang: "",
        soDienThoai: "",
        diaChiNhan: "",
        ngayGui: new Date().toISOString().split('T')[0]
    });
    
    // Add a state to track whether data has been loaded
    const [dataLoaded, setDataLoaded] = useState(false);
    
    // Debug state to track API status
    const [debugState, setDebugState] = useState({
        apiStatus: {
            account: null,
            customer: null, 
            testOrders: null,
            services: null
        },
        testOrdersData: null
    });

    // Lấy thông tin account, customer, testorder
    useEffect(() => {
        // Skip if data has already been loaded - prevents double loading
        if (dataLoaded) return;
        
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Starting data fetch - first time only");
                
                // Lấy accountId từ localStorage
                const accountId = localStorage.getItem('accountId');
                console.log("AccountId from localStorage:", accountId);

                if (!accountId) {
                    setError("Không tìm thấy thông tin tài khoản");
                    setLoading(false);
                    return;
                }

                // 1. Lấy thông tin account trước
                console.log("Fetching account info...");
                try {
                    const accountResponse = await fetchAccountInfo();
                    console.log("Account data:", accountResponse);
                    setAccountData(accountResponse.data);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, account: "success"}
                    }));
                } catch (accErr) {
                    console.error("Account fetch error:", accErr);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, account: "error"}
                    }));
                }
                
                // 2. Sau đó lấy thông tin customer
                console.log("Fetching customer info...");
                let customerData = null;
                try {
                    const customerResponse = await getCustomerByAccountId(accountId);
                    console.log("Customer data:", customerResponse);
                    customerData = customerResponse.data;
                    setCustomer(customerData);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, customer: "success"}
                    }));
                } catch (custErr) {
                    console.error("Customer fetch error:", custErr);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, customer: "error"}
                    }));
                }
                
                // 3. DIRECTLY test the test orders endpoint
                console.log("DIRECT TEST: Fetching test orders...");
                try {
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, testOrders: "loading"}
                    }));
                    
                    const testOrdersResponse = await axiosInstance.get('/api/testorders');
                    console.log("★★★ Test Orders Response:", testOrdersResponse);
                    
                    if (testOrdersResponse && testOrdersResponse.data) {
                        console.log("★★★ All test orders:", testOrdersResponse.data);
                        setDebugState(prev => ({
                            ...prev, 
                            apiStatus: {...prev.apiStatus, testOrders: "success"},
                            testOrdersData: testOrdersResponse.data
                        }));
                        
                        if (customerData && customerData.id) {
                            // Filter orders for this customer
                            const customerOrders = testOrdersResponse.data.filter(
                                order => order.customerId == customerData.id
                            );
                            console.log("★★★ Customer orders:", customerOrders);
                            
                            if (customerOrders && customerOrders.length > 0) {
                                // Use the first order
                                const latestOrder = customerOrders[0];
                                console.log("★★★ Setting test order:", latestOrder);
                                setTestOrder(latestOrder);
                                
                                // Set kit info from test order
                                setKitInfo(prev => ({
                                    ...prev,
                                    serviceId: latestOrder.serviceId?.toString() || "",
                                    maBoKit: latestOrder.kitCode || "",
                                    ngayGui: latestOrder.orderDate ? 
                                        (typeof latestOrder.orderDate === 'string' ? 
                                            latestOrder.orderDate.split('T')[0] : 
                                            new Date(latestOrder.orderDate).toISOString().split('T')[0]) 
                                        : new Date().toISOString().split('T')[0]
                                }));
                            } else {
                                console.log("★★★ No orders found for this customer");
                            }
                        }
                    } else {
                        console.log("★★★ Test orders response is invalid:", testOrdersResponse);
                        setDebugState(prev => ({
                            ...prev, 
                            apiStatus: {...prev.apiStatus, testOrders: "empty"}
                        }));
                    }
                } catch (orderError) {
                    console.error("★★★ Test orders fetch error:", orderError);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, testOrders: "error"}
                    }));
                }

                // 4. Set kit info from account and customer
                setKitInfo(prev => {
                    const newInfo = { ...prev };
                    
                    // From account
                    if (accountData) {
                        newInfo.tenKhachHang = accountData.fullName || "";
                        newInfo.soDienThoai = accountData.phone || "";
                    }
                    
                    // From customer
                    if (customerData) {
                        newInfo.diaChiNhan = customerData.address || "";
                    }
                    
                    return newInfo;
                });

                // 5. Get services
                console.log("Fetching services...");
                try {
                    const servicesData = await getAllServices();
                    console.log("Services:", servicesData);
                    setServices(servicesData || []);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, services: "success"}
                    }));
                } catch (servErr) {
                    console.error("Services fetch error:", servErr);
                    setDebugState(prev => ({
                        ...prev, 
                        apiStatus: {...prev.apiStatus, services: "error"}
                    }));
                }

                // Mark data as loaded so we don't load it again
                setDataLoaded(true);
                setLoading(false);
            } catch (err) {
                console.error("Error in main fetchData:", err);
                setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchData();
    }, [dataLoaded]);

    // Create test order function for debugging purposes
    const createTestOrderForDebug = async () => {
        if (!customer || !customer.id) {
            alert("No customer information available");
            return;
        }
        
        try {
            alert("Creating a test order for debugging...");
            
            const testData = {
                customerId: Number(customer.id),
                staffId: null,
                serviceId: 1, // Assuming service ID 1 exists or pass any valid service ID
                orderDate: new Date().toISOString().split('T')[0],
                sampleType: "DNA Test Sample",
                orderStatus: "PENDING",
                resultDeliveryMethod: "Email",
                resultDeliverAddress: customer.address || "Test Address",
                kitCode: "DEBUG-KIT-" + new Date().getTime(),
                sampleQuantity: 1,
                amount: 1
            };
            
            console.log("Debug test order data:", testData);
            const response = await axiosInstance.post('/api/testorders', testData);
            console.log("Debug order created:", response.data);
            
            alert("Test order created successfully! Check console for details.");
            
            // Refresh test orders
            const refreshResponse = await axiosInstance.get('/api/testorders');
            setDebugState(prev => ({
                ...prev,
                testOrdersData: refreshResponse.data,
                apiStatus: {...prev.apiStatus, testOrders: "success"}
            }));
            
            // Find the new order for this customer
            const customerOrders = refreshResponse.data.filter(
                order => order.customerId == customer.id
            );
            
            if (customerOrders && customerOrders.length > 0) {
                setTestOrder(customerOrders[0]);
            }
            
        } catch (error) {
            console.error("Error creating debug test order:", error);
            alert("Error creating test order: " + error.message);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setKitInfo({
            ...kitInfo,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission - create a test order
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customer.id) {
            setError("Customer information is required");
            return;
        }

        try {
            console.log("Creating a new test order...");
            
            // Convert the form data to a TestOrderDTO
            const testOrderData = {
                customerId: Number(customer.id),
                staffId: null, // This can be null initially
                serviceId: Number(kitInfo.serviceId),
                orderDate: kitInfo.ngayGui,
                sampleType: "DNA Sample",
                orderStatus: "PENDING",
                resultDeliveryMethod: "Email",
                resultDeliverAddress: kitInfo.diaChiNhan,
                kitCode: kitInfo.maBoKit,
                sampleQuantity: 1,
                amount: 1
            };

            console.log("Test order data:", testOrderData);
            
            // Send POST request to create a test order
            const response = await axiosInstance.post("/api/testorders", testOrderData);
            console.log("Order created response:", response);
            
            setTestOrder(response.data);
            setConfirmed(true);
        } catch (err) {
            console.error("Error creating order:", err);
            setError("Failed to submit the order: " + (err.response?.data?.message || err.message));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // If parsing fails, return the original string
            return date.toLocaleDateString('vi-VN'); // Format for Vietnamese locale
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="container">
            {/* Debug Section - Remove in production */}
            <div style={{background: '#f7f7f7', padding: '10px', margin: '10px 0', fontSize: '12px', border: '1px solid #ddd'}}>
                <h4>API Status</h4>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    {Object.entries(debugState.apiStatus).map(([key, status]) => (
                        <div key={key} style={{
                            padding: '5px 10px', 
                            borderRadius: '3px',
                            backgroundColor: 
                                status === 'success' ? '#d4edda' : 
                                status === 'loading' ? '#cce5ff' : 
                                status === 'error' ? '#f8d7da' :
                                status === 'empty' ? '#fff3cd' : '#e2e3e5'
                        }}>
                            <b>{key}:</b> {status || 'not started'}
                        </div>
                    ))}
                </div>
                
                <div style={{marginTop: '10px'}}>
                    <button onClick={async () => {
                        try {
                            const response = await axiosInstance.get('/api/testorders');
                            console.log("Manual test of /api/testorders:", response.data);
                            alert(`Test orders API call succeeded! Found ${response.data ? response.data.length : 0} orders.`);
                            setDebugState(prev => ({
                                ...prev, 
                                testOrdersData: response.data,
                                apiStatus: {...prev.apiStatus, testOrders: "success"}
                            }));
                        } catch (error) {
                            console.error("Manual test error:", error);
                            alert("Error testing endpoint: " + error.message);
                            setDebugState(prev => ({
                                ...prev, 
                                apiStatus: {...prev.apiStatus, testOrders: "error"}
                            }));
                        }
                    }} style={{padding: '5px', marginRight: '5px'}}>
                        Test /api/testorders
                    </button>
                    
                    <button onClick={createTestOrderForDebug} style={{padding: '5px', backgroundColor: '#28a745', color: 'white'}}>
                        Create Debug Test Order
                    </button>
                </div>
                
                <details style={{marginTop: '10px'}}>
                    <summary>Test Orders Data ({debugState.testOrdersData ? debugState.testOrdersData.length : 0} orders)</summary>
                    <pre style={{maxHeight: '200px', overflow: 'auto', background: '#f1f1f1', padding: '10px'}}>
                        {JSON.stringify(debugState.testOrdersData, null, 2) || "No data"}
                    </pre>
                </details>
            </div>
            
            {/* Customer Information */}
            <div className="customer-info">
                <h3>Thông tin Khách hàng</h3>
                <div>
                    {/* Dựa vào dữ liệu từ console.log, sử dụng đúng tên trường */}
                    <div><b>Họ và tên:</b> {accountData?.fullName || "N/A"}</div>
                    <div><b>Ngày sinh:</b> {formatDate(customer?.dateOfBirth) || "N/A"}</div>
                    <div><b>Giới tính:</b> {customer?.gender || "N/A"}</div>
                    <div><b>Số điện thoại:</b> {accountData?.phone || "N/A"}</div>
                    <div><b>Địa chỉ:</b> {customer?.address || "N/A"}</div>
                    <div><b>Email:</b> {accountData?.email || "N/A"}</div>
                    <div><b>Mã đơn:</b> {testOrder?.orderId || testOrder?.id || "N/A"}</div>
                    <div><b>Ngày đặt lịch:</b> {formatDate(testOrder?.orderDate) || "N/A"}</div>
                </div>
            </div>

            {/* Sample Collection Form */}
            <form className="form-section" onSubmit={handleSubmit}>
                <h2 className="form-title">Chuẩn bị lấy mẫu</h2>

                {/* Service Selection */}
                <div className="form-row">
                    <label><b>Chọn dịch vụ:</b></label>
                    <select
                        name="serviceId"
                        value={kitInfo.serviceId}
                        onChange={handleChange}
                        className="form-input"
                        required
                    >
                        <option value="">-- Chọn dịch vụ --</option>
                        {services.map(service => (
                            <option key={service.serviceID || service.id} value={service.serviceID || service.id}>
                                {service.serviceName || service.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <label><b>Tên bộ kit:</b></label>
                    <input
                        name="tenBoKit"
                        value={kitInfo.tenBoKit}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Mã bộ kit:</b></label>
                    <input
                        name="maBoKit"
                        value={kitInfo.maBoKit}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Tên khách hàng:</b></label>
                    <input
                        name="tenKhachHang"
                        value={kitInfo.tenKhachHang}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Số điện thoại:</b></label>
                    <input
                        name="soDienThoai"
                        value={kitInfo.soDienThoai}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Địa chỉ nhận:</b></label>
                    <input
                        name="diaChiNhan"
                        value={kitInfo.diaChiNhan}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Ngày gửi:</b></label>
                    <input
                        type="date"
                        name="ngayGui"
                        value={kitInfo.ngayGui}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-actions">
                    {!confirmed ? (
                        <>
                            <button type="submit" className="btn btn-primary">Xác nhận gửi</button>
                            <button type="button" className="btn btn-cancel">Hủy</button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-primary">Xác nhận</button>
                    )}
                </div>
                {confirmed && (
                    <div className="confirm-message">
                        <b>
                            Xác nhận trung tâm đã nhận lại thành công bộ kit<br />
                            có mẫu xét nghiệm của khách gửi lại
                        </b>
                    </div>
                )}
            </form>
        </div>
    );
}

export default TuThuGuiMau;