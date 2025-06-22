import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TestResultInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, customerId, savedSamples } = location.state || {};

  const [testResultSamples, setTestResultSamples] = useState(
    savedSamples.map(sample => ({
      testSampleId: sample.id,
      relationship: sample.relationship,
      loci: [{ locusName: '', allele1: '', allele2: '' }]
    }))
  );
  const [showResults, setShowResults] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [results, setResults] = useState([]);
  const [resultError, setResultError] = useState("");

  const addTestResultSample = (index) => {
    const newSamples = [...testResultSamples];
    newSamples[index].loci.push({ locusName: '', allele1: '', allele2: '' });
    setTestResultSamples(newSamples);
  };

  const removeTestResultSample = (sampleIndex, locusIndex) => {
    const newSamples = [...testResultSamples];
    if (newSamples[sampleIndex].loci.length > 1) {
      newSamples[sampleIndex].loci.splice(locusIndex, 1);
      setTestResultSamples(newSamples);
    }
  };

  const updateLocus = (sampleIndex, locusIndex, field, value) => {
    const newSamples = [...testResultSamples];
    newSamples[sampleIndex].loci[locusIndex][field] = value;
    setTestResultSamples(newSamples);
  };

  const validateTestResultSamples = () => {
    if (testResultSamples.length < 2) {
      setResultError('Vui lòng nhập ít nhất 2 mẫu.');
      return false;
    }
    const sampleIds = testResultSamples.map(s => s.testSampleId);
    if (new Set(sampleIds).size !== sampleIds.length) {
      setResultError('Mã mẫu không được trùng nhau.');
      return false;
    }
    for (let sample of testResultSamples) {
      if (!sample.testSampleId || !sample.relationship) {
        setResultError('Vui lòng điền đầy đủ mã mẫu và mối quan hệ.');
        return false;
      }
      for (let locus of sample.loci) {
        if (!locus.locusName || !locus.allele1 || !locus.allele2) {
          setResultError('Vui lòng điền đầy đủ thông tin locus.');
          return false;
        }
      }
      const locusKeys = sample.loci.map(l => `${sample.testSampleId}-${l.locusName}`);
      if (new Set(locusKeys).size !== locusKeys.length) {
        setResultError(`Locus trùng lặp trong mẫu ID ${sample.testSampleId}.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitTestResultSamples = async () => {
    if (!validateTestResultSamples()) return;
    setResultError('');

    for (let sample of testResultSamples) {
      const testResultSamplesData = sample.loci.map(locus => ({
        testSampleId: parseInt(sample.testSampleId),
        locusName: locus.locusName,
        allele1: locus.allele1,
        allele2: locus.allele2,
      }));
      try {
        await axios.post('http://localhost:8080/api/test-result-samples/list', testResultSamplesData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } catch (err) {
        setResultError('Lỗi khi lưu TestResultSample: ' + (err.response?.data?.message || err.message));
        return;
      }
    }
    setShowResults(true);
  };

  const handleShowResults = async () => {
    if (selectedPairs.length === 0) {
      setResultError('Vui lòng chọn ít nhất một cặp mẫu.');
      return;
    }
    setResultError('');

    const newResults = [];
    for (let pair of selectedPairs) {
      const [i, j] = pair.split('-').map(Number);
      const sampleId1 = parseInt(testResultSamples[i].testSampleId);
      const sampleId2 = parseInt(testResultSamples[j].testSampleId);
      const testResultDTO = {
        orderId: parseInt(orderId),
        customerId: parseInt(customerId),
        sampleId1,
        sampleId2,
        resultUrl: 'Kết quả sẽ được cập nhật sau',
      };

      try {
        const response = await axios.post('http://localhost:8080/api/test-results/create', testResultDTO, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        newResults.push({
          ...response.data,
          sampleId1,
          sampleId2,
        });
      } catch (err) {
        setResultError('Lỗi khi lưu TestResult: ' + (err.response?.data?.message || err.message));
        return;
      }
    }
    setResults(newResults);
    navigate(`/order-detail/${orderId}`, { state: { results: newResults } });
  };

  const handleExportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text(`Kết quả xét nghiệm ADN - Đơn hàng #${orderId}`, 10, y);
    y += 10;

    results.forEach(result => {
      doc.setFontSize(12);
      doc.text(`TestResult ID: ${result.id}`, 10, y);
      y += 10;
      doc.text(`Mẫu 1: ID ${result.sampleId1} - ${testResultSamples.find(s => parseInt(s.testSampleId) === result.sampleId1)?.relationship}`, 10, y);
      y += 10;
      doc.text(`Mẫu 2: ID ${result.sampleId2} - ${testResultSamples.find(s => parseInt(s.testSampleId) === result.sampleId2)?.relationship}`, 10, y);
      y += 10;
      doc.text(`Kết quả: ${result.result}`, 10, y);
      y += 10;
      doc.text(`Phần trăm khớp: ${result.resultPercent}`, 10, y);
      y += 20;
    });

    doc.save(`ket_qua_xet_nghiem_order_${orderId}.pdf`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Nhập thông số xét nghiệm ADN</h1>

        {!showResults ? (
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Nhập thông số mẫu xét nghiệm</h2>
            {testResultSamples.map((sample, sampleIndex) => (
              <div key={sampleIndex} className="border p-4 mb-4 rounded">
                <div className="mb-2">
                  <label className="block font-bold mb-1">Mã mẫu (TestSample ID):</label>
                  <input
                    type="number"
                    value={sample.testSampleId}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Mối quan hệ:</label>
                  <input
                    type="text"
                    value={sample.relationship}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <table className="w-full border-collapse mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Locus Name</th>
                      <th className="border p-2">Allele 1</th>
                      <th className="border p-2">Allele 2</th>
                      <th className="border p-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sample.loci.map((locus, locusIndex) => (
                      <tr key={locusIndex}>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={locus.locusName}
                            onChange={(e) => updateLocus(sampleIndex, locusIndex, 'locusName', e.target.value)}
                            className="w-full p-1"
                            placeholder="VD: D3S1358"
                            required
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={locus.allele1}
                            onChange={(e) => updateLocus(sampleIndex, locusIndex, 'allele1', e.target.value)}
                            className="w-full p-1"
                            placeholder="VD: 15"
                            required
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={locus.allele2}
                            onChange={(e) => updateLocus(sampleIndex, locusIndex, 'allele2', e.target.value)}
                            className="w-full p-1"
                            placeholder="VD: 16"
                            required
                          />
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => removeTestResultSample(sampleIndex, locusIndex)}
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => addTestResultSample(sampleIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                >
                  Thêm Locus
                </button>
              </div>
            ))}
            {resultError && <p className="text-red-500 text-center">{resultError}</p>}
            <div className="text-center">
              <button
                onClick={handleSubmitTestResultSamples}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Tiếp tục chọn cặp so sánh
              </button>
              <button
                onClick={() => navigate(`/order-detail/${orderId}`)}
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Chọn cặp mẫu để xem và lưu kết quả</h2>
            <div className="mb-4">
              {testResultSamples.map((_, i) => (
                testResultSamples.slice(i + 1).map((_, j) => (
                  <div key={`${i}-${i + j + 1}`} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        value={`${i}-${i + j + 1}`}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPairs([...selectedPairs, e.target.value]);
                          } else {
                            setSelectedPairs(selectedPairs.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span className="ml-2">
                        Mẫu {i + 1} (ID: {testResultSamples[i].testSampleId} - {testResultSamples[i].relationship}) vs 
                        Mẫu {i + j + 2} (ID: {testResultSamples[i + j + 1].testSampleId} - {testResultSamples[i + j + 1].relationship})
                      </span>
                    </label>
                  </div>
                ))
              ))}
            </div>
            {resultError && <p className="text-red-500 text-center">{resultError}</p>}
            <div className="text-center mb-4">
              <button
                onClick={handleShowResults}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Hiển thị và lưu kết quả
              </button>
              {results.length > 0 && (
                <button
                  onClick={handleExportPDF}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                >
                  Tải PDF
                </button>
              )}
              <button
                onClick={() => {
                  setShowResults(false);
                  setResults([]);
                  setSelectedPairs([]);
                  setResultError('');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Quay lại nhập thông số
              </button>
            </div>
            {results.length > 0 && (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">TestResult ID</th>
                    <th className="border p-2">Mẫu 1</th>
                    <th className="border p-2">Mẫu 2</th>
                    <th className="border p-2">Kết quả</th>
                    <th className="border p-2">Phần trăm khớp</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="border p-2">{result.id}</td>
                      <td className="border p-2">
                        ID: {result.sampleId1} - {testResultSamples.find(s => parseInt(s.testSampleId) === result.sampleId1)?.relationship}
                      </td>
                      <td className="border p-2">
                        ID: {result.sampleId2} - {testResultSamples.find(s => parseInt(s.testSampleId) === result.sampleId2)?.relationship}
                      </td>
                      <td className={`border p-2 ${result.result.includes('Có') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}`}>
                        {result.result}
                      </td>
                      <td className="border p-2">{result.resultPercent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultInput;