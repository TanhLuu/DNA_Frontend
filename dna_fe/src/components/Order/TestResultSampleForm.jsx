import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/TestResultSampleForm.css"; // Sử dụng lại CSS đã viết theo tiền tố trs-

const TestResultSampleForm = ({ orderId, testSamples, sampleQuantity, onClose }) => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locusNames = [
    "D8S1179", "D21S11", "D7S820", "CFS1PO", "D3S1358", "TH01", "D13S317",
    "D16S539", "D2S1338", "D19S433", "vWA", "TPOX", "D18S51",
    "AMEL", "D5S818", "FGA"
  ];

  useEffect(() => {
    const fetchExistingResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/test-result-samples/order/${orderId}`);
        const existingResults = response.data;

        const initialData = locusNames.map(locus => ({
          locusName: locus,
          samples: Array.from({ length: sampleQuantity }, (_, index) => {
            const testSample = testSamples[index] || { id: index + 1, name: `Sample ${index + 1}` };
            const existingSample = existingResults.find(
              result => result.testSampleId === testSample.id && result.locusName === locus
            );
            return {
              testSampleId: testSample.id,
              name: testSample.name || "N/A",
              allele1: existingSample ? existingSample.allele1 : "",
              allele2: existingSample ? existingSample.allele2 : ""
            };
          })
        }));
        setFormData(initialData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu TestResultSample:", err);
        setError("Lỗi khi tải dữ liệu: " + err.message);
      }
    };

    fetchExistingResults();
  }, [orderId, testSamples, sampleQuantity]);

  const handleInputChange = (locusIndex, sampleIndex, field, value) => {
    const updatedData = [...formData];
    updatedData[locusIndex].samples[sampleIndex][field] = value;
    setFormData(updatedData);
  };

  const handleSubmit = async () => {
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

    try {
      const response = await axios.post("http://localhost:8080/api/test-result-samples/list", payload, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.status === 200) {
        alert("Dữ liệu đã được gửi thành công!");
        setFormData(locusNames.map(locus => ({
          locusName: locus,
          samples: Array.from({ length: sampleQuantity }, (_, index) => {
            const testSample = testSamples[index] || { id: index + 1, name: `Sample ${index + 1}` };
            return {
              testSampleId: testSample.id,
              name: testSample.name || "N/A",
              allele1: "",
              allele2: ""
            };
          })
        })));
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
        <h2 className="trs-title">Nhập Kết Quả Mẫu Xét Nghiệm</h2>
        {error && <div className="trs-error-message">{error}</div>}
        <table className="trs-table">
          <thead>
            <tr>
              <th>Locus Name</th>
              {Array.from({ length: sampleQuantity }, (_, index) => (
                <th key={index} colSpan={2}>
                  {testSamples[index]?.name || `Sample ${index + 1}`}
                </th>
              ))}
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
                          disabled={loading}
                        />
                      </td>
                      <td>
                        <input
                          className="trs-input"
                          type="text"
                          value={sample.allele2}
                          onChange={(e) => handleInputChange(locusIndex, sampleIndex, "allele2", e.target.value)}
                          disabled={loading}
                        />
                      </td>
                    </React.Fragment>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="trs-button-group">
          <button
            className="trs-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
          <button
            className="trs-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultSampleForm;
