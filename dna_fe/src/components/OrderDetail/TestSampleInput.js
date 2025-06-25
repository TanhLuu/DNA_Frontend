// components/Order/TestSampleInput.js
import React from "react";

const TestSampleInput = ({
  sample,
  index,
  onChange,
  isDisabled,
  shouldShowKitCode,
  shouldShowFullFields,
}) => {
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <div className="border border-dashed border-gray-400 p-4 mb-4 rounded">
      <h4 className="font-semibold mb-3">Mẫu #{index + 1}</h4>
      {shouldShowKitCode && (
        <div className="mb-2">
          <input
            placeholder="Mã Kit"
            value={sample.kitCode || ""}
            onChange={(e) => handleChange("kitCode", e.target.value)}
            className="border p-2 w-full rounded"
            disabled={isDisabled}
          />
        </div>
      )}
      <div className="mb-2">
        <input
          placeholder="Họ tên"
          value={sample.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border p-2 w-full rounded"
          disabled={isDisabled}
        />
      </div>
      <div className="mb-2">
        <select
          value={sample.gender || ""}
          onChange={(e) => handleChange("gender", e.target.value)}
          className="border p-2 w-full rounded"
          disabled={isDisabled}
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>
      <div className="mb-2">
        <input
          type="date"
          value={sample.dateOfBirth || ""}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          className="border p-2 w-full rounded"
          disabled={isDisabled}
        />
      </div>
      <div className="mb-2">
        <select
          value={sample.relationship || ""}
          onChange={(e) => handleChange("relationship", e.target.value)}
          className="border p-2 w-full rounded"
          disabled={isDisabled}
        >
          <option value="">Chọn quan hệ</option>
          <option value="CHA">Cha</option>
          <option value="MẸ">Mẹ</option>
          <option value="CON">Con</option>
          <option value="ÔNG">Ông</option>
          <option value="BÀ">Bà</option>
          <option value="CHÁU">Cháu</option>
          <option value="ANH">Anh</option>
          <option value="CHỊ">Chị</option>
          <option value="EM">Em</option>
        </select>
      </div>
      <div className="mb-2">
        <select
          value={sample.sampleType || ""}
          onChange={(e) => handleChange("sampleType", e.target.value)}
          className="border p-2 w-full rounded"
          disabled={isDisabled}
        >
          <option value="">Chọn loại mẫu</option>
          <option value="Mau">Mẫu máu</option>
          <option value="Toc">Mẫu tóc</option>
          <option value="Mong">Mẫu móng</option>
          <option value="NiemMac">Mẫu niêm mạc</option>
        </select>
      </div>
      {shouldShowFullFields() && (
        <>
          <div className="mb-2">
            <input
              placeholder="Số mẫu"
              value={sample.sampleNumber || ""}
              onChange={(e) => handleChange("sampleNumber", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <input
              placeholder="Địa chỉ"
              value={sample.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <select
              value={sample.documentType || ""}
              onChange={(e) => handleChange("documentType", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            >
              <option value="CCCD">CCCD</option>
              <option value="GKS">Giấy khai sinh</option>
              <option value="HoChieu">Hộ chiếu</option>
            </select>
          </div>
          <div className="mb-2">
            <input
              placeholder="Số giấy tờ"
              value={sample.documentNumber || ""}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              value={sample.dateOfIssue || ""}
              onChange={(e) => handleChange("dateOfIssue", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              value={sample.expirationDate || ""}
              onChange={(e) => handleChange("expirationDate", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <input
              placeholder="Nơi cấp"
              value={sample.placeOfIssue || ""}
              onChange={(e) => handleChange("placeOfIssue", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <input
              placeholder="Quốc tịch"
              value={sample.nationality || ""}
              onChange={(e) => handleChange("nationality", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
          <div className="mb-2">
            <input
              placeholder="Vân tay"
              value={sample.fingerprint || ""}
              onChange={(e) => handleChange("fingerprint", e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isDisabled}
            />
          </div>
        </>
      )}
      <div className="mb-2">
        <select
          value={sample.medicalHistory || ""}
          onChange={(e) => handleChange("medicalHistory", e.target.value)}
          className="border p-2 w-full rounded"
          disabled={isDisabled}
        >
          <option value="">Chọn tiền sử bệnh</option>
          <option value="Khong">Không</option>
          <option value="Co">Có</option>
        </select>
      </div>
    </div>
  );
};

export default TestSampleInput;