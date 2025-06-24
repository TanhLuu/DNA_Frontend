import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getTestSamplesByOrderId } from "../../api/customerOrderApi";

const TestResultInput = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [testResultSamples, setTestResultSamples] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [results, setResults] = useState([]);
  const [resultError, setResultError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin đơn hàng để lấy customerId
        const orderResponse = await axios.get(`http://localhost:8080/api/testorders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCustomerId(orderResponse.data.customerId);

        // Lấy danh sách mẫu xét nghiệm
        const existingSamples = await getTestSamplesByOrderId(orderId);
        setTestResultSamples(existingSamples.map(sample => ({
          testSampleId: sample.id,
          relationship: sample.relationship,
          loci: [{ locusName: '', allele1: '', allele2: '' }]
        })));
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setUpdateError("Lỗi khi tải dữ liệu mẫu xét nghiệm hoặc đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

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
    if (selectedPairs.length === 0) {
      setResultError('Vui lòng chọn ít nhất một cặp mẫu để so sánh.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTestResultSamples()) return;
    setResultError('');
    setUpdateError(null);

    try {
      // Gửi dữ liệu TestResultSample
      for (let sample of testResultSamples) {
        const testResultSamplesData = sample.loci.map(locus => ({
          testSampleId: parseInt(sample.testSampleId),
          locusName: locus.locusName,
          allele1: locus.allele1,
          allele2: locus.allele2,
        }));
        await axios.post('http://localhost:8080/api/test-result-samples/list', testResultSamplesData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      // Gửi dữ liệu TestResult
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

        const response = await axios.post('http://localhost:8080/api/test-results/create', testResultDTO, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        newResults.push({
          ...response.data,
          sampleId1,
          sampleId2,
        });
      }
      setResults(newResults);

      // Cập nhật trạng thái đơn hàng sang TESTED
      const staffId = localStorage.getItem('staffId');
      await axios.put(`http://localhost:8080/api/testorders/${orderId}`, {
        staffId,
        orderStatus: 'TESTED',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Lưu kết quả và cập nhật trạng thái đơn hàng thành công!");
      navigate(`/admin/orders/${orderId}`);
    } catch (err) {
      console.error("Lỗi khi lưu dữ liệu:", err);
      setUpdateError(
        'Lỗi khi lưu dữ liệu: ' + (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (localStorage.getItem('staffRole') !== 'LAB_STAFF') {
    return <div className="text-center p-6 text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {updateError && <div className="text-red-500 mb-4 text-center">{updateError}</div>}
        {resultError && <div className="text-red-500 mb-4 text-center">{resultError}</div>}
        <h2 className="text-2xl font-bold text-center mb-6">Nhập thông số xét nghiệm cho đơn hàng #{orderId}</h2>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Thông số xét nghiệm</h3>
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

          <h3 className="text-xl font-semibold mb-4 mt-6">Chọn cặp mẫu để so sánh</h3>
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
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Lưu và hiển thị kết quả
            </button>
            <button
              onClick={() => navigate(`/admin/orders/${orderId}`)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </section>

        {results.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Kết quả xét nghiệm</h3>
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
                    <td className={`border p-2 ${result.result?.includes('Có') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}`}>
  {result.result || 'Chưa có'}
</td>
<td className="border p-2">{result.resultPercent || 'Chưa có'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default TestResultInput;