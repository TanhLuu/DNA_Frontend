import React from "react";

const TestResultsAndSamples = ({ testResults, testResultSamples, testSamples, uniqueSamples, uniqueLoci }) => {
  return (
    <>
      {testResults.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Kết quả xét nghiệm</h3>
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Người 1</th>
                <th className="border p-2 text-left">Người 2</th>
                <th className="border p-2 text-left">Kết quả</th>
                <th className="border p-2 text-left">Phần trăm trùng khớp</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => {
                const sample1 = testSamples.find((s) => s.id === result.sampleId1);
                const sample2 = testSamples.find((s) => s.id === result.sampleId2);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {sample1 ? `${sample1.name} (${sample1.relationship || "N/A"})` : "N/A"}
                    </td>
                    <td className="border p-2">
                      {sample2 ? `${sample2.name} (${sample2.relationship || "N/A"})` : "N/A"}
                    </td>
                    <td
                      className={`border p-2 ${
                        result.result.includes("không có quan hệ huyết thống")
                          ? "text-red-600 font-bold"
                          : "text-green-600 font-bold"
                      }`}
                    >
                      {result.result || "N/A"}
                    </td>
                    <td className="border p-2">{result.resultPercent || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {testResultSamples.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Thông số xét nghiệm</h3>
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left"></th>
                {uniqueSamples.map((sample) => (
                  <th key={sample.id} className="border p-2 text-left">
                    {sample.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uniqueLoci.map((locus, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{locus}</td>
                  {uniqueSamples.map((sample) => {
                    const resultSample = testResultSamples.find(
                      (rs) => rs.locusName === locus && rs.testSampleId === sample.id
                    );
                    return (
                      <td key={sample.id} className="border p-2">
                        {resultSample
                          ? `${resultSample.allele1}/${resultSample.allele2}`
                          : "N/A"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};

export default TestResultsAndSamples;