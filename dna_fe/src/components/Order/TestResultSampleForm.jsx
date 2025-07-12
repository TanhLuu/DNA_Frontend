import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/TestResultSampleForm.css";

const TestResultSampleForm = ({ orderId, testSamples, sampleQuantity, orderStatus, staffRole, onClose }) => {
  const [formData, setFormData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedResults, setSelectedResults] = useState([]);
  const role = localStorage.getItem('role'); // Lấy từ bảng account

  const isReadOnly = staffRole === "NORMAL_STAFF" || orderStatus !== "COLLECT_SAMPLE";

  const locusNames = [
    "D8S1179", "D21S11", "D7S820", "CFS1PO", "D3S1358", "TH01", "D13S317",
    "D16S539", "D2S1338", "D19S433", "vWA", "TPOX", "D18S51",
    "AMEL", "D5S818", "FGA"
  ];

  useEffect(() => {
    const fetchExistingResults = async () => {
      try {
        // Lấy dữ liệu mẫu xét nghiệm
        const sampleResponse = await axios.get(`http://localhost:8080/api/test-result-samples/order/${orderId}`);
        const existingSamples = sampleResponse.data || [];

        // Khởi tạo formData cho bảng nhập allele
        const initialData = locusNames.map(locus => ({
          locusName: locus,
          samples: Array.from({ length: sampleQuantity }, (_, index) => {
            const testSample = testSamples[index] || { id: index + 1, name: `Sample ${index + 1}`, relationship: "Không có" };
            const existingSample = existingSamples.find(
              result => result.testSampleId === testSample.id && result.locusName === locus
            );
            return {
              testSampleId: testSample.id,
              name: testSample.name || "Không có",
              relationship: testSample.relationship || "Không có",
              allele1: existingSample ? existingSample.allele1 : "",
              allele2: existingSample ? existingSample.allele2 : ""
            };
          })
        }));
        setFormData(initialData);

        // Lấy dữ liệu kết quả
        const resultResponse = await axios.get(`http://localhost:8080/api/test-results/order/${orderId}`);
        const existingResults = Array.isArray(resultResponse.data) ? resultResponse.data : []; // Đảm bảo là mảng

        // Khởi tạo resultData với tất cả các cặp mẫu, ngay cả khi chưa có dữ liệu
        const initialResults = [];
        for (let i = 0; i < sampleQuantity; i++) {
          for (let j = i + 1; j < sampleQuantity; j++) {
            const sample1Id = testSamples[i]?.id || i + 1;
            const sample2Id = testSamples[j]?.id || j + 1;
            const existingResult = existingResults.find(
              r => (r.sampleId1 === sample1Id && r.sampleId2 === sample2Id) ||
                (r.sampleId1 === sample2Id && r.sampleId2 === sample1Id)
            );
            initialResults.push({
              sample1Id,
              sample2Id,
              result: existingResult ? existingResult.result : "",
              resultPercent: existingResult ? existingResult.resultPercent : ""
            });
          }
        }
        setResultData(initialResults);
        setSelectedResults(new Array(initialResults.length).fill(false));
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Lỗi khi tải dữ liệu: " + err.message);

        // Khởi tạo resultData mặc định ngay cả khi có lỗi
        const initialResults = [];
        for (let i = 0; i < sampleQuantity; i++) {
          for (let j = i + 1; j < sampleQuantity; j++) {
            const sample1Id = testSamples[i]?.id || i + 1;
            const sample2Id = testSamples[j]?.id || j + 1;
            initialResults.push({
              sample1Id,
              sample2Id,
              result: "",
              resultPercent: ""
            });
          }
        }
        setResultData(initialResults);
        setSelectedResults(new Array(initialResults.length).fill(false));
      }
    };

    fetchExistingResults();
  }, [orderId, testSamples, sampleQuantity]);
  const handleInputChange = (locusIndex, sampleIndex, field, value) => {
    if (isReadOnly) return;
    const updatedData = [...formData];
    updatedData[locusIndex].samples[sampleIndex][field] = value;
    setFormData(updatedData);
  };

  const handleResultChange = (index, field, value) => {
    if (isReadOnly) return;
    const updatedResults = [...resultData];
    updatedResults[index][field] = value;
    setResultData(updatedResults);
  };

  const handleCheckboxChange = (index) => {
    if (isReadOnly) return;
    const updatedSelected = [...selectedResults];
    updatedSelected[index] = !updatedSelected[index];
    setSelectedResults(updatedSelected);
  };

  const handlePrintPDF = async (sampleId1, sampleId2) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pdf/export/samples?sampleId1=${sampleId1}&sampleId2=${sampleId2}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `result_${sampleId1}_${sampleId2}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {


    }
  };

  const handleSubmit = async () => {
    if (isReadOnly) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    const payload = formData.flatMap(locus =>
      locus.samples
        .filter(sample => sample.allele1 || sample.allele2)
        .map(sample => ({
          testSampleId: sample.testSampleId,
          locusName: locus.locusName,
          allele1: sample.allele1,
          allele2: sample.allele2
        }))
    );

    const resultPayload = resultData
      .filter((_, index) => selectedResults[index])
      .map(item => ({
        orderId: orderId,
        sampleId1: item.sample1Id,
        sampleId2: item.sample2Id,
        result: item.result,
        resultPercent: item.resultPercent
      }));

    try {
      const alleleResponse = await axios.post("http://localhost:8080/api/test-result-samples/list", payload, {
        headers: { "Content-Type": "application/json" }
      });

      const resultResponse = await axios.post("http://localhost:8080/api/test-results/create", resultPayload, {
        headers: { "Content-Type": "application/json" }
      });

      if (alleleResponse.status === 200 && resultResponse.status === 200) {
        alert("Dữ liệu đã được gửi thành công!");
        setFormData(locusNames.map(locus => ({
          locusName: locus,
          samples: Array.from({ length: sampleQuantity }, (_, index) => {
            const testSample = testSamples[index] || { id: index + 1, name: `Sample ${index + 1}`, relationship: "Không có" };
            return {
              testSampleId: testSample.id,
              name: testSample.name || "Không có",
              relationship: testSample.relationship || "Không có",
              allele1: "",
              allele2: ""
            };
          })
        })));
        setResultData(resultData.map(r => ({ ...r, result: "", resultPercent: "" })));
        setSelectedResults(new Array(resultData.length).fill(false));
        onClose();
      }
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
      setError("Lỗi khi gửi dữ liệu: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trs-modal-overlay">
      <div className="trs-form-container">
        <h2 className="trs-title">{isReadOnly ? "Xem Kết Quả Mẫu Xét Nghiệm" : "Nhập Kết Quả Mẫu Xét Nghiệm"}</h2>
        {error && <div className="trs-error-message">{error}</div>}
        <table className="trs-table">
          <thead>
            <tr>
              <th>Locus Name</th>
              {Array.from({ length: sampleQuantity }, (_, index) => {
                const sample = testSamples[index] || { name: `Sample ${index + 1}`, relationship: "Không có" };
                return (
                  <th key={index} colSpan={2}>
                    {sample.name} - {sample.relationship}
                  </th>
                );
              })}
            </tr>
            <tr>
              <th></th>
              {Array.from({ length: sampleQuantity }, (_, index) => (
                <React.Fragment key={index}>
                  <th>Allele 1</th>
                  <th>Allele 2</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.map((locus, locusIndex) => (
              <tr key={locus.locusName}>
                <td>{locus.locusName}</td>
                {locus.samples.map((sample, sampleIndex) => (
                  sampleIndex < sampleQuantity && (
                    <React.Fragment key={sample.testSampleId}>
                      <td>
                        <input
                          className="trs-input"
                          type="text"
                          value={sample.allele1}
                          onChange={(e) => handleInputChange(locusIndex, sampleIndex, "allele1", e.target.value)}
                          disabled={loading || isReadOnly}
                        />
                      </td>
                      <td>
                        <input
                          className="trs-input"
                          type="text"
                          value={sample.allele2}
                          onChange={(e) => handleInputChange(locusIndex, sampleIndex, "allele2", e.target.value)}
                          disabled={loading || isReadOnly}
                        />
                      </td>
                    </React.Fragment>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {resultData.length > 0 && (
          <table className="trs-table">
            <thead>
              <tr>
                <th>Mẫu 1</th>
                <th>Mẫu 2</th>
                <th>Kết luận</th>
                <th>Chỉ số kết hợp (CPI)</th>
                <th>Chọn cặp kết quả</th>
                {(staffRole === "NORMAL_STAFF" || role === "MANAGER") && <th>In kết quả</th>}
              </tr>
            </thead>
            <tbody>
              {resultData.map((result, index) => {
                const sample1 = testSamples.find(s => s.id === result.sample1Id) || { name: "Không có", relationship: "Không có" };
                const sample2 = testSamples.find(s => s.id === result.sample2Id) || { name: "Không có", relationship: "Không có" };
                return (
                  <tr key={index}>
                    <td>{`${sample1.name} - ${sample1.relationship}`}</td>
                    <td>{`${sample2.name} - ${sample2.relationship}`}</td>
                    <td>
                      <input
                        className="trs-input"
                        type="text"
                        value={result.result}
                        onChange={(e) => handleResultChange(index, "result", e.target.value)}
                        disabled={loading || isReadOnly}
                        style={{ width: "100%", boxSizing: "border-box" }}
                      />
                    </td>
                    <td>
                      <input
                        className="trs-input"
                        type="text"
                        value={result.resultPercent}
                        onChange={(e) => handleResultChange(index, "resultPercent", e.target.value)}
                        disabled={loading || isReadOnly}
                        style={{ width: "100%", boxSizing: "border-box" }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedResults[index] || false}
                        onChange={() => handleCheckboxChange(index)}
                        disabled={loading || isReadOnly}
                      />
                    </td>
                    {(staffRole === "NORMAL_STAFF" || role === "MANAGER") && (
                      <td>
                        <button
                          className="trs-print-btn"
                          onClick={() => handlePrintPDF(result.sample1Id, result.sample2Id)}
                          disabled={loading}
                        >
                          In
                        </button>
                      </td>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="trs-button-group">
          {!isReadOnly && (
            <button
              className="trs-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          )}
          <button
            className="trs-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            {isReadOnly ? "Đóng" : "Hủy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultSampleForm;