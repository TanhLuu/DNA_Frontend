// components/Order/TestSampleSection.js
import React from "react";

const TestSampleSection = ({ samples, formatDate, shouldShowKitCode, shouldShowFullFields }) => {
  if (samples.length === 0) {
    return <p className="text-gray-500">Chưa có mẫu xét nghiệm nào.</p>;
  }

  return (
    <>
      {samples.map((sample, idx) => (
        <div key={idx} className="border p-4 mb-4 rounded">
          <h4 className="font-semibold">Mẫu #{idx + 1}</h4>
          {shouldShowKitCode && (
            <p>
              <strong>Mã kit:</strong> {sample.kitCode || "N/A"}
            </p>
          )}
          <p>
            <strong>Họ tên:</strong> {sample.name || "N/A"}
          </p>
          <p>
            <strong>Giới tính:</strong> {sample.gender || "N/A"}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {formatDate(sample.dateOfBirth)}
          </p>
          <p>
            <strong>Quan hệ:</strong> {sample.relationship || "N/A"}
          </p>
          <p>
            <strong>Loại mẫu:</strong> {sample.sampleType || "N/A"}
          </p>
          {shouldShowFullFields() && (
            <>
              <p>
                <strong>Số mẫu:</strong> {sample.sampleNumber || "N/A"}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {sample.address || "N/A"}
              </p>
              <p>
                <strong>Loại giấy tờ:</strong> {sample.documentType || "N/A"}
              </p>
              <p>
                <strong>Số giấy tờ:</strong> {sample.documentNumber || "N/A"}
              </p>
              <p>
                <strong>Ngày cấp:</strong> {formatDate(sample.dateOfIssue)}
              </p>
              <p>
                <strong>Hết hạn:</strong> {formatDate(sample.expirationDate)}
              </p>
              <p>
                <strong>Nơi cấp:</strong> {sample.placeOfIssue || "N/A"}
              </p>
              <p>
                <strong>Quốc tịch:</strong> {sample.nationality || "N/A"}
              </p>
              <p>
                <strong>Vân tay:</strong> {sample.fingerprint || "N/A"}
              </p>
            </>
          )}
          <p>
            <strong>Tiền sử bệnh:</strong> {sample.medicalHistory || "N/A"}
          </p>
        </div>
      ))}
    </>
  );
};

export default TestSampleSection;