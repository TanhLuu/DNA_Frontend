import React, { useState } from 'react';
import CreateStaff from '../../components/UI/Auth/CreateStaff';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import '../../styles/admin/dashboard.css';

const sampleActivityData = [
    { name: 'T4', newSamples: 300, completed: 450, error: 30 },
    { name: 'T5', newSamples: 350, completed: 500, error: 25 },
    { name: 'T6', newSamples: 370, completed: 480, error: 20 },
    { name: 'T7', newSamples: 400, completed: 600, error: 10 },
    { name: 'T8', newSamples: 390, completed: 590, error: 15 },
    { name: 'T9', newSamples: 360, completed: 550, error: 10 },
];

const statusData = [
    { name: 'Đã hoàn tất', value: 60 },
    { name: 'Chờ mẫu', value: 20 },
    { name: 'Lỗi/Hủy', value: 10 },
];

const revenueData = [
    { name: 'T4', revenue: 210 },
    { name: 'T5', revenue: 240 },
    { name: 'T6', revenue: 280 },
    { name: 'T7', revenue: 300 },
    { name: 'T8', revenue: 280 },
    { name: 'T9', revenue: 260 },
];

const COLORS = ['#0088FE', '#FFBB28', '#FF4D4F'];


const Dashboard = () => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div className="dashboard">
            {/* Cards Section */}
            <div className="dashboard__cards">
                <div className="card" />
                <div className="card" />
                <div className="card" />
                <div className="card" />
                <div className="card--buttons">
                    <button className="btn btn--register" onClick={() => setShowPopup(true)}>Tạo tài khoản</button>
                    <button className="btn btn--pdf">PDF</button>
                    <button className="btn btn--excel">Excel</button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="dashboard__charts">
                <div className="chart">
                    <h3>Hoạt động xét nghiệm (6 tháng)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sampleActivityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="newSamples" name="Mẫu mới tiếp nhận" fill="#0088FE" />
                            <Bar dataKey="completed" name="Mẫu hoàn thành" fill="#00C49F" />
                            <Bar dataKey="error" name="Mẫu lỗi" fill="#FF4D4F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart">
                    <h3>Tình trạng xét nghiệm</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue and Orders */}
            <div className="dashboard__bottom">
                <div className="chart">
                    <h3>Doanh thu theo tháng</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit=" triệu" />
                            <Tooltip />
                            <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="table-placeholder">
                    <h3>Đơn hàng gần đây</h3>
                    {/* Bạn sẽ fetch và render table sau */}
                </div>
            </div>
            {showPopup && <CreateStaff onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default Dashboard;
