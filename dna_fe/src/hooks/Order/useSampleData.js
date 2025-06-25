// hooks/Order/useSampleData.js
export const useSampleData = (testResultSamples, testSamples) => {
  const uniqueSamples = [
    ...new Set(testResultSamples.map((sample) => sample.testSampleId)),
  ].map((id) => {
    const sample = testSamples.find((s) => s.id === id);
    return { id, name: sample?.name || "N/A" };
  });

  const uniqueLoci = [...new Set(testResultSamples.map((sample) => sample.locusName))];

  return { uniqueSamples, uniqueLoci };
};