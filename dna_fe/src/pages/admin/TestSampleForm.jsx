import React, { useEffect, useState } from "react";
import axios from "axios";

const TestSampleForm = ({ orderId, customerId, sampleQuantity, serviceType, sampleMethod, isCustomer, onClose }) => {
  const [testSamples, setTestSamples] = useState([]);
  const [formData, setFormData] = useState({
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
    kitCode: '',
  });
  const [editingSampleId, setEditingSampleId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Định nghĩa các trường hiển thị dựa trên serviceType, sampleMethod và isCustomer
  const fieldsToShow = () => {
    if (serviceType === "Dân sự") {
      const baseFields = ['name', 'gender', 'dateOfBirth', 'relationship', 'sampleType'];
      if (sampleMethod === "home") {
        return [...baseFields, 'kitCode'];
      }
      return baseFields;
    } else if (serviceType === "Hành chính") {
      return [
        'name', 'gender', 'dateOfBirth', 'documentType', 'documentNumber',
        'dateOfIssue', 'expirationDate', 'placeOfIssue', 'nationality',
        'address', 'sampleType', 'numberOfSample', 'relationship',
        'medicalHistory', 'fingerprint'
      ];
    }
    return [];
  };

  // Nhãn hiển thị cho các trường
  const fieldLabels = {
    name: 'Họ tên',
    gender: 'Giới tính',
    dateOfBirth: 'Ngày sinh',
    documentType: 'Loại giấy tờ (CCCD/Hộ Chiếu/Giấy khai sinh)',
    documentNumber: 'Số giấy tờ',
    dateOfIssue: 'Ngày cấp',
    expirationDate: 'Ngày hết hạn',
    placeOfIssue: 'Nơi cấp',
    nationality: 'Quốc tịch',
    address: 'Địa chỉ',
    sampleType: 'Loại mẫu',
    numberOfSample: 'Số lượng mẫu',
    relationship: 'Mối quan hệ',
    medicalHistory: 'Tiền sử bệnh (Có bệnh về máu, truyền máu, ghép tủy trong 6 tháng) (Có/Không)',
    fingerprint: 'Vân tay',
    kitCode: 'Mã kit',
  };

  useEffect(() => {
    const fetchTestSamples = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/testSamples/order/${orderId}`);
        setTestSamples(response.data);
        // Hiển thị form nếu số TestSample chưa đạt sampleQuantity (chỉ cho admin)
        if (!isCustomer && response.data.length < sampleQuantity) {
          setShowForm(true);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách Test Samples:', error);
        alert('Có lỗi xảy ra khi lấy danh sách Test Samples: ' + error.message);
      }
    };
    fetchTestSamples();
  }, [orderId, sampleQuantity, isCustomer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      alert('Không tìm thấy Customer ID từ đơn hàng');
      return;
    }

    const payload = {
      ...formData,
      orderId: parseInt(orderId),
      customerId: parseInt(customerId),
      numberOfSample: parseInt(formData.numberOfSample) || null,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      dateOfIssue: formData.dateOfIssue ? new Date(formData.dateOfIssue).toISOString() : null,
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null
    };

    try {
      if (editingSampleId) {
        // Chế độ cập nhật
        const response = await axios.put(`http://localhost:8080/api/testSamples/${editingSampleId}`, payload);
        setTestSamples(testSamples.map(sample => sample.id === editingSampleId ? response.data : sample));
        alert('Cập nhật Test Sample thành công!');
        setEditingSampleId(null);
        setShowForm(false);
      } else {
        // Chế độ thêm mới
        if (testSamples.length >= sampleQuantity) {
          alert('Số lượng Test Sample đã đạt giới hạn theo đơn hàng!');
          return;
        }
        const response = await axios.post('http://localhost:8080/api/testSamples', payload);
        setTestSamples([...testSamples, response.data]);
        alert('Thêm Test Sample thành công!');
        if (testSamples.length + 1 >= sampleQuantity) {
          setShowForm(false);
          onClose();
        }
      }

      // Reset form
      setFormData({
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
        kitCode: '',
      });
    } catch (error) {
      console.error('Lỗi khi lưu Test Sample:', error);
      alert('Có lỗi xảy ra khi lưu Test Sample: ' + error.message);
    }
  };

  const handleEdit = (sample) => {
    setEditingSampleId(sample.id);
    setShowForm(true);
    setFormData({
      name: sample.name || '',
      gender: sample.gender || '',
      dateOfBirth: sample.dateOfBirth ? new Date(sample.dateOfBirth).toISOString().split('T')[0] : '',
      documentType: sample.documentType || '',
      documentNumber: sample.documentNumber || '',
      dateOfIssue: sample.dateOfIssue ? new Date(sample.dateOfIssue).toISOString().split('T')[0] : '',
      expirationDate: sample.expirationDate ? new Date(sample.expirationDate).toISOString().split('T')[0] : '',
      placeOfIssue: sample.placeOfIssue || '',
      nationality: sample.nationality || '',
      address: sample.address || '',
      sampleType: sample.sampleType || '',
      numberOfSample: sample.numberOfSample || '',
      relationship: sample.relationship || '',
      medicalHistory: sample.medicalHistory || '',
      fingerprint: sample.fingerprint || '',
      kitCode: sample.kitCode || '',
    });
  };

  const handleClose = () => {
    setEditingSampleId(null);
    setShowForm(false);
    setFormData({
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
      kitCode: '',
    });
    if (testSamples.length >= sampleQuantity) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">
          {editingSampleId ? `Cập nhật Test Sample #${editingSampleId}` : `Thêm Test Sample`} ({testSamples.length}/{sampleQuantity})
        </h2>
        {showForm && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {fieldsToShow().map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">{fieldLabels[key]}</label>
                <input
                  type={key.includes('date') ? 'date' : key === 'numberOfSample' ? 'number' : 'text'}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder={`Nhập ${fieldLabels[key]}`}
                  disabled={isCustomer && key === 'kitCode'}
                />
              </div>
            ))}
            <div className="col-span-2 flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                onClick={handleClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${testSamples.length >= sampleQuantity && !editingSampleId ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={testSamples.length >= sampleQuantity && !editingSampleId}
              >
                {editingSampleId ? 'Lưu' : 'Thêm'}
              </button>
            </div>
          </form>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Danh sách Test Samples</h3>
          {testSamples.length > 0 ? (
            <ul className="space-y-2">
              {testSamples.map(sample => (
                <li key={sample.id} className="border p-4 rounded shadow-sm">
                  <p><strong>ID:</strong> {sample.id}</p>
                  {fieldsToShow().map(key => (
                    <p key={key}><strong>{fieldLabels[key]}:</strong> {sample[key] || 'N/A'}</p>
                  ))}
                  <button
                    onClick={() => handleEdit(sample)}
                    className="bg-yellow-500 text-white p-1 rounded"
                  >
                    Cập nhật
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có Test Sample nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSampleForm;