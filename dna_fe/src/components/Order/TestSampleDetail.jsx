import React, { useEffect, useState } from "react";
import axios from "axios";

const TestSampleDetail = ({ orderId, testSampleId, serviceType, sampleMethod, onClose }) => {
  const [testSample, setTestSample] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  useEffect(() => {
    const fetchTestSample = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/testSamples/${testSampleId}`);
        setTestSample(response.data);
      } catch (err) {
        setError("Không thể lấy thông tin TestSample. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSample();
  }, [testSampleId]);

  // Xác định các trường cần hiển thị dựa trên serviceType và sampleMethod
  const getFieldsToDisplay = () => {
    if (serviceType === "Dân sự") {
      const baseFields = [
        { key: "name", label: "Tên" },
        { key: "gender", label: "Giới tính" },
        { key: "dateOfBirth", label: "Ngày sinh", format: formatDate },
        { key: "relationship", label: "Mối quan hệ" },
        { key: "sampleType", label: "Loại mẫu" },
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
        { key: "sampleType", label: "Loại mẫu" },
        { key: "numberOfSample", label: "Số lượng mẫu" },
        { key: "relationship", label: "Mối quan hệ" },
        { key: "medicalHistory", label: "Có bệnh về máu, truyền máu, ghép tủy trong 6 tháng" },
        { key: "fingerprint", label: "Vân tay" },
      ];
    }
    return [];
  };

  const fieldsToDisplay = getFieldsToDisplay();

  
  if (error) return <div className="text-red-500">{error}</div>;
  if (!testSample) return <div>Không tìm thấy mẫu xét nghiệm</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Chi tiết mẫu xét nghiệm #{testSample.id}</h3>
        {fieldsToDisplay.map((field) => (
          <p key={field.key} className="mb-2">
            <strong>{field.label}:</strong>{" "}
            {field.format ? field.format(testSample[field.key]) : testSample[field.key] || "N/A"}
          </p>
        ))}
        <button
          className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TestSampleDetail;