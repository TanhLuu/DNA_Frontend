import React, { useEffect, useState } from "react";
import { getTestSampleById, getAllSampleTypes } from "../../api/orderApi";
import "../../styles/sample/TestSampleDetail.css";

const TestSampleDetail = ({ orderId, testSampleId, serviceType, sampleMethod, onClose }) => {
  const [testSample, setTestSample] = useState(null);
  const [sampleTypes, setSampleTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "Không có";

  const getSampleTypeName = (sampleTypeId) => {
    const sampleType = sampleTypes.find(type => type.id === sampleTypeId);
    return sampleType ? sampleType.sampleType : "Không có";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const sample = await getTestSampleById(testSampleId);
        const types = await getAllSampleTypes();
        setTestSample(sample);
        setSampleTypes(types);
      } catch (err) {
        setError("Không thể lấy thông tin TestSample. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testSampleId]);

  const getFieldsToDisplay = () => {
    if (serviceType === "Dân sự") {
      const baseFields = [
        { key: "name", label: "Tên" },
        { key: "gender", label: "Giới tính" },
        { key: "dateOfBirth", label: "Ngày sinh", format: formatDate },
        { key: "relationship", label: "Mối quan hệ" },
        { key: "sampleTypeId", label: "Loại mẫu", format: getSampleTypeName },
      ];
      if (sampleMethod === "home") {
        return [...baseFields, { key: "kitCode", label: "Mã kit" }];
      }
      return baseFields;
    } else if (serviceType === "Hành chính") {
      return [
        { key: "name", label: "Tên" },
        { key: "gender", label: "Giới tính" },
        { key: "dateOfBirth", label: "Ngày sinh", format: formatDate },
        { key: "documentType", label: "Loại giấy tờ" },
        { key: "documentNumber", label: "Số giấy tờ" },
        { key: "dateOfIssue", label: "Ngày cấp", format: formatDate },
        { key: "expirationDate", label: "Ngày hết hạn", format: formatDate },
        { key: "placeOfIssue", label: "Nơi cấp" },
        { key: "nationality", label: "Quốc tịch" },
        { key: "address", label: "Địa chỉ" },
        { key: "sampleTypeId", label: "Loại mẫu", format: getSampleTypeName },
        { key: "numberOfSample", label: "Số lượng mẫu" },
        { key: "relationship", label: "Mối quan hệ" },
        { key: "medicalHistory", label: "Có bệnh về máu, truyền máu, ghép tủy trong 6 tháng" },
      ];
    }
    return [];
  };

  const fieldsToDisplay = getFieldsToDisplay();

  if (loading) return <div className="test-sample-detail-loading">Đang tải...</div>;
  if (error) return <div className="test-sample-detail-error">{error}</div>;
  if (!testSample) return <div className="test-sample-detail-not-found">Không tìm thấy mẫu xét nghiệm</div>;

  return (
    <div className="test-sample-detail-overlay">
      <div className="test-sample-detail-container">
        <h3 className="test-sample-detail-title">
          Chi tiết mẫu xét nghiệm #{testSample.id}
        </h3>
        <div className="test-sample-detail-info">
          {fieldsToDisplay.map((field) => (
            <p key={field.key} className="test-sample-detail-field">
              <strong>{field.label}:</strong>{" "}
              {field.format ? field.format(testSample[field.key]) : testSample[field.key] || "Không có"}
            </p>
          ))}
        </div>
        <button className="test-sample-detail-close-btn" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TestSampleDetail;
