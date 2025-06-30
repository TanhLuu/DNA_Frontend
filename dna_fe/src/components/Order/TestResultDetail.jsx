import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/customer/TestResultDetail.css";

const TestResultDetail = ({ orderId, fullName, address, relationship1, relationship2, onClose }) => {
  const [testResults, setTestResults] = useState([]);
  const [testResultSamples, setTestResultSamples] = useState([]);
  const [testSamples, setTestSamples] = useState([]);
  const [selectedTestResultId, setSelectedTestResultId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách TestResult theo orderId
        const testResultResponse = await axios.get(
          `http://localhost:8080/api/test-results/order/${orderId}`
        );
        setTestResults(testResultResponse.data);

        // Lấy danh sách TestResultSample theo orderId
        const testResultSampleResponse = await axios.get(
          `http://localhost:8080/api/test-result-samples/order/${orderId}`
        );
        setTestResultSamples(testResultSampleResponse.data);

        // Lấy danh sách TestSample theo orderId
        const testSampleResponse = await axios.get(
          `http://localhost:8080/api/testSamples/order/${orderId}`
        );
        setTestSamples(testSampleResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu kết quả xét nghiệm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Lọc TestResultSample theo TestSampleId liên quan đến TestResult được chọn
  const getRelatedTestResultSamples = (testResult) => {
    const relatedSampleIds = [testResult.sampleId1, testResult.sampleId2].filter(id => id);
    return testResultSamples.filter(sample =>
      relatedSampleIds.includes(sample.testSampleId)
    );
  };

  // Lấy tên mẫu dựa trên sampleId
  const getTestSampleName = (sampleId) => {
    const sample = testSamples.find(s => s.id === sampleId);
    return sample ? sample.name : `Mẫu ${sampleId}`;
  };

  // Lấy relationship dựa trên sampleId
  const getTestSampleRelationship = (sampleId) => {
    const sample = testSamples.find(s => s.id === sampleId);
    return sample ? sample.relationship || "N/A" : "N/A";
  };

  // Tạo bảng chi tiết mẫu xét nghiệm với các mẫu liên quan
  const renderTestResultSampleTable = (samples, relatedSampleIds) => {
    const loci = [...new Set(samples.map(s => s.locusName))].sort();
    const relatedSampleNames = relatedSampleIds.map(id => getTestSampleName(id));

    return (
      <table className="test-result-sample-table">
        <thead>
          <tr>
            <th rowSpan="2">Locus Name</th>
            {relatedSampleNames.map((name, index) => (
              <th colSpan="2" key={index}>{name}</th>
            ))}
          </tr>
          <tr>
            {relatedSampleNames.map((_, index) => (
              <React.Fragment key={index}>
                <th>Allele 1</th>
                <th>Allele 2</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {loci.map(locus => (
            <tr key={locus}>
              <td>{locus || "N/A"}</td>
              {relatedSampleNames.map((sampleName, index) => {
                const sampleId = testSamples.find(s => s.name === sampleName)?.id;
                const sampleData = samples.find(s => s.testSampleId === sampleId && s.locusName === locus);
                return (
                  <React.Fragment key={index}>
                    <td>{sampleData ? sampleData.allele1 || "N/A" : "N/A"}</td>
                    <td>{sampleData ? sampleData.allele2 || "N/A" : "N/A"}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) return <div className="test-result-detail-container">Đang tải...</div>;
  if (error) return <div className="test-result-detail-container error">{error}</div>;
  if (testResults.length === 0)
    return <div className="test-result-detail-container">Không có kết quả xét nghiệm.</div>;

  return (
    <div className="test-result-detail-overlay">
      <div className="test-result-detail-container">
        <h2>Xem Kết Quả Mẫu Xét Nghiệm</h2>
        <div className="user-info">
          <p><strong> Căn cứ vào giấy đề nghị phân tích ADN số: HID{orderId}</strong> </p>
          <p><strong>Của Ông/Bà:</strong> {fullName || "N/A"}</p>
          <p><strong>Địa chỉ:</strong> {address || "N/A"}</p>
          <br />
        </div>

        {/* Danh sách TestResult */}
        <div className="test-result-section">
          <h3>Danh sách kết quả xét nghiệm</h3>
          <table className="test-result-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mẫu 1</th>
                <th>Mẫu 2</th>
                <th>Kết quả</th>
                <th>Tỷ lệ (%)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{getTestSampleName(result.sampleId1)} - {getTestSampleRelationship(result.sampleId1)}</td>
                  <td>{getTestSampleName(result.sampleId2)} - {getTestSampleRelationship(result.sampleId2)}</td>
                  <td>{result.result || "N/A"}</td>
                  <td>{result.resultPercent || "N/A"}</td>
                  <td>
                    <button
                      className="test-result-detail-button"
                      onClick={() => setSelectedTestResultId(result.id)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chi tiết TestResult được chọn */}
        {selectedTestResultId && (
          <div className="test-result-detail-section">
            <h3>Chi tiết kết quả xét nghiệm #{selectedTestResultId}</h3>
            {(() => {
              const selectedResult = testResults.find(r => r.id === selectedTestResultId);
              if (!selectedResult) return <p>Kết quả không tồn tại.</p>;

              const relatedSamples = getRelatedTestResultSamples(selectedResult);
              const relatedSampleIds = [selectedResult.sampleId1, selectedResult.sampleId2].filter(id => id);

              return (
                <div>
                  <div className="test-result-info">
                    <p><strong>Mẫu 1:</strong> {getTestSampleName(selectedResult.sampleId1)} - {getTestSampleRelationship(selectedResult.sampleId1)}</p>
                    <p><strong>Mẫu 2:</strong> {getTestSampleName(selectedResult.sampleId2)} - {getTestSampleRelationship(selectedResult.sampleId2)}</p>
                    <p><strong>Kết quả:</strong> {selectedResult.result || "N/A"}</p>
                    <p><strong>Tỷ lệ:</strong> {selectedResult.resultPercent || "N/A"}</p>
                  </div>

                  {relatedSamples.length > 0 ? (
                    <div className="test-result-sample-section">
                      <h4>Chi tiết mẫu xét nghiệm</h4>
                      {renderTestResultSampleTable(relatedSamples, relatedSampleIds)}
                    </div>
                  ) : (
                    <p>Không có mẫu xét nghiệm liên quan.</p>
                  )}
                </div>
              );
            })()}
            <button
              className="test-result-detail-close"
              onClick={() => setSelectedTestResultId(null)}
            >
              Đóng chi tiết
            </button>
          </div>
        )}

        <button className="test-result-detail-close" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TestResultDetail;