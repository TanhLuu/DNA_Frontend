import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/sample/TestSampleForm.css";

const TestSampleForm = ({ orderId, customerId, sampleQuantity, serviceType, sampleMethod, isCustomer, onClose }) => {
  const [testSamples, setTestSamples] = useState([]);
  const [sampleTypes, setSampleTypes] = useState([]);
  const dateFields = ['dateOfBirth', 'dateOfIssue', 'expirationDate'];
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
    sampleTypeId: '',
    numberOfSample: '',
    relationship: '',
    medicalHistory: '',
    fingerprint: '',
    kitCode: '',
  });
  const [editingSampleId, setEditingSampleId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Hàm định dạng ngày theo kiểu vi-VN (dd/mm/yyyy)
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  // Hàm lấy tên SampleType từ sampleTypeId
  const getSampleTypeName = (sampleTypeId) => {
    const sampleType = sampleTypes.find(type => type.id === sampleTypeId);
    return sampleType ? sampleType.sampleType : "N/A";
  };

  // Định nghĩa các trường hiển thị dựa trên serviceType, sampleMethod và isCustomer
  const fieldsToShow = () => {
    if (serviceType === "Dân sự") {
      const baseFields = ['name', 'gender', 'dateOfBirth', 'relationship', 'sampleTypeId'];
      if (sampleMethod === "home") {
        return [...baseFields, 'kitCode'];
      }
      return baseFields;
    } else if (serviceType === "Hành chính") {
      return [
        'name', 'gender', 'dateOfBirth', 'address', 'documentType', 'documentNumber',
        'dateOfIssue', 'expirationDate', 'placeOfIssue', 'nationality',
        'sampleTypeId', 'numberOfSample', 'relationship',
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
    address: 'Địa chỉ',
    documentNumber: 'Số giấy tờ',
    dateOfIssue: 'Ngày cấp',
    expirationDate: 'Ngày hết hạn',
    placeOfIssue: 'Nơi cấp',
    nationality: 'Quốc tịch',
    documentType: 'Loại giấy tờ',
    sampleTypeId: 'Loại mẫu',
    numberOfSample: 'Số lượng mẫu',
    relationship: 'Mối quan hệ',
    medicalHistory: 'Có bệnh về máu, truyền máu, ghép tủy trong 6 tháng',
    fingerprint: 'Vân tay (Tải ảnh)',
    kitCode: 'Mã kit',
  };

  // Lấy danh sách SampleType và TestSample
  useEffect(() => {
    const fetchSampleTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/sample-types');
        setSampleTypes(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách loại mẫu:', error);
        alert('Có lỗi xảy ra khi lấy danh sách loại mẫu: ' + error.message);
      }
    };

    const fetchTestSamples = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/testSamples/order/${orderId}`);
        setTestSamples(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách mẫu xét nghiệm:', error);
        alert('Có lỗi xảy ra khi lấy danh sách mẫu xét nghiệm: ' + error.message);
      }
    };

    fetchSampleTypes();
    fetchTestSamples();
  }, [orderId]);

  // Xử lý khi người dùng chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, fingerprint: base64String });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

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
        const response = await axios.put(`http://localhost:8080/api/testSamples/${editingSampleId}`, payload);
        setTestSamples(testSamples.map(sample => sample.id === editingSampleId ? response.data : sample));
        alert('Cập nhật mẫu xét nghiệm thành công!');
        setEditingSampleId(null);
        setShowForm(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/testSamples', payload);
        setTestSamples([...testSamples, response.data]);
        alert('Thêm Test Sample thành công!');
        if (testSamples.length + 1 >= sampleQuantity) {
          setShowForm(false);
          onClose();
        }
      }

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
        sampleTypeId: '',
        numberOfSample: '',
        relationship: '',
        medicalHistory: '',
        fingerprint: '',
        kitCode: '',
      });
      setPreviewImage('');
    } catch (error) {
      console.error('Lỗi khi lưu mẫu xét nghiệm:', error);
      alert('Có lỗi xảy ra khi lưu mẫu xét nghiệm: ' + error.message);
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
      sampleTypeId: sample.sampleType?.id || '',
      numberOfSample: sample.numberOfSample || '',
      relationship: sample.relationship || '',
      medicalHistory: sample.medicalHistory || '',
      fingerprint: sample.fingerprint || '',
      kitCode: sample.kitCode || '',
    });
    setPreviewImage(sample.fingerprint || '');
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
      sampleTypeId: '',
      numberOfSample: '',
      relationship: '',
      medicalHistory: '',
      fingerprint: '',
      kitCode: '',
    });
    setPreviewImage('');
  };

  const showKitCodeWarning = () => {
    return !isCustomer && serviceType === "Dân sự" && sampleMethod === "home";
  };

  return (
    <div className="test-sample-form-overlay">
      <div className={`test-sample-form-container ${showForm ? 'expanded' : ''}`}>
        {/* Left: Danh sách */}
        <div className="test-sample-form-list">
          <div className="test-sample-form-header">
            <h2 className="test-sample-form-title">
              Danh sách mẫu xét nghiệm ({testSamples.length}/{sampleQuantity})
            </h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {testSamples.length < sampleQuantity && !isCustomer && (
                <button
                  className="test-sample-form-add-btn"
                  onClick={() => {
                    setEditingSampleId(null);
                    setShowForm(true);
                  }}
                >
                  + Thêm mẫu
                </button>
              )}
              <button className="test-sample-form-close-btn" onClick={onClose}>×</button>
            </div>
          </div>
          {testSamples.length > 0 ? (
            <ul className="test-sample-form-ul">
              {testSamples.map(sample => (
                <li key={sample.id} className="test-sample-form-item">
                  <div className="test-sample-form-grid">
                    {fieldsToShow().map(key => (
                      <div key={key} className="test-sample-form-grid-item">
                        <strong>{fieldLabels[key]}:</strong>{" "}
                        {key === 'fingerprint' && sample[key] ? (
                          <img src={sample[key]} alt="Vân tay" style={{ width: '50px', height: '50px' }} />
                        ) : key.includes("date") && sample[key] ? (
                          formatDate(sample[key])
                        ) : key === 'sampleTypeId' ? (
                          getSampleTypeName(sample.sampleTypeId) // Sử dụng hàm để lấy tên SampleType
                        ) : (
                          sample[key] || "N/A"
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleEdit(sample)}
                    className="test-sample-form-edit-btn"
                  >
                    Cập nhật
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có mẫu xét nghiệm nào.</p>
          )}
        </div>

        {/* Right: Form */}
        {showForm && (
          <div className="test-sample-form-panel">
            <div className="test-sample-form-header">
              <h3>
                {editingSampleId ? `Cập nhật mẫu xét nghiệm #${editingSampleId}` : "Thêm mẫu xét nghiệm"}
              </h3>
              <button className="test-sample-form-close-btn" onClick={handleClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="test-sample-form-fields">
              {/* Nhóm 1: Họ tên - Giới tính - Ngày sinh */}
              <div className="test-sample-form-group-row">
                {['name', 'gender', 'dateOfBirth'].map((key) => (
                  fieldsToShow().includes(key) && (
                    <div key={key} className="test-sample-form-field flex-1">
                      <label>{fieldLabels[key]}</label>
                      {key === 'gender' ? (
                        <select
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      ) : (
                        <input
                          type={dateFields.includes(key) ? "date" : "text"}
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                          placeholder={fieldLabels[key]}
                        />
                      )}
                    </div>
                  )
                ))}
              </div>

              {/* Nhóm 2: Loại giấy tờ - Số giấy tờ - Quốc tịch */}
              <div className="test-sample-form-group-row">
                {['documentType', 'documentNumber', 'nationality'].map((key) => (
                  fieldsToShow().includes(key) && (
                    <div key={key} className="test-sample-form-field flex-1">
                      <label>{fieldLabels[key]}</label>
                      {key === 'documentType' ? (
                        <select
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn loại giấy tờ</option>
                          <option value="CCCD">CCCD</option>
                          <option value="Hộ chiếu">Hộ chiếu</option>
                          <option value="Giấy khai sinh">Giấy khai sinh</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                          placeholder={fieldLabels[key]}
                        />
                      )}
                    </div>
                  )
                ))}
              </div>

              {/* Nhóm 3: Ngày cấp - Ngày hết hạn - Nơi cấp */}
              <div className="test-sample-form-group-row">
                {['dateOfIssue', 'expirationDate', 'placeOfIssue'].map((key) => (
                  fieldsToShow().includes(key) && (
                    <div key={key} className="test-sample-form-field flex-1">
                      <label>{fieldLabels[key]}</label>
                      <input
                        type={dateFields.includes(key) ? "date" : "text"}
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        placeholder={fieldLabels[key]}
                      />
                    </div>
                  )
                ))}
              </div>

              {/* Nhóm 4: Loại mẫu - Số lượng mẫu - Mối quan hệ */}
              <div className="test-sample-form-group-row">
                {['sampleTypeId', 'numberOfSample', 'relationship'].map((key) => (
                  fieldsToShow().includes(key) && (
                    <div key={key} className="test-sample-form-field flex-1">
                      <label>{fieldLabels[key]}</label>
                      {key === 'sampleTypeId' ? (
                        <select
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn loại mẫu</option>
                          {sampleTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.sampleType}
                            </option>
                          ))}
                        </select>
                      ) : key === 'relationship' ? (
                        <select
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn mối quan hệ</option>
                          <option value="Cha">Cha</option>
                          <option value="Mẹ">Mẹ</option>
                          <option value="Con">Con</option>
                          <option value="Anh">Anh</option>
                          <option value="Chị">Chị</option>
                          <option value="Em">Em</option>
                          <option value="Ông">Ông</option>
                          <option value="Bà">Bà</option>
                          <option value="Cháu">Cháu</option>
                        </select>
                      ) : (
                        <input
                          type={key === 'numberOfSample' ? 'number' : 'text'}
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                          placeholder={fieldLabels[key]}
                        />
                      )}
                    </div>
                  )
                ))}
              </div>

              {/* Các trường còn lại hiển thị đơn lẻ */}
              {['address', 'medicalHistory', 'fingerprint', 'kitCode'].map((key) =>
                fieldsToShow().includes(key) && (
                  <div key={key} className="test-sample-form-field">
                    <label>{fieldLabels[key]}</label>
                    {key === 'fingerprint' ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {previewImage && (
                          <div>
                            <p>Xem trước:</p>
                            <img src={previewImage} alt="Vân tay xem trước" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                          </div>
                        )}
                      </div>
                    ) : key === 'medicalHistory' ? (
                      <select
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                      >
                        <option value="">Chọn tình trạng</option>
                        <option value="Có">Có</option>
                        <option value="Không">Không</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        placeholder={fieldLabels[key]}
                        disabled={isCustomer && key === 'kitCode'}
                      />
                    )}
                  </div>
                )
              )}

              {showKitCodeWarning() && (
                <p className="test-sample-form-warning">
                  Vui lòng cập nhật mã số kit cho khách hàng
                </p>
              )}

              <div className="test-sample-form-buttons">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={testSamples.length >= sampleQuantity && !editingSampleId}
                >
                  {editingSampleId ? "Lưu" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSampleForm;