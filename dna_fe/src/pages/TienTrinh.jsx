import React ,{useState} from "react";

export default function Step1Form({ defaultData, onNext }) {
  const [data, setData] = useState(defaultData || { fieldA: "", fieldB: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onNext(data); }}>
      <input
        name="fieldA"
        value={data.fieldA}
        onChange={handleChange}
        placeholder="Field A"
      />
      <input
        name="fieldB"
        value={data.fieldB}
        onChange={handleChange}
        placeholder="Field B"
      />
      <button type="submit">Tiếp tục</button>
    </form>
  );
}