import { useState } from "react";

function FoodForm() {
  const [value, setValue] = useState({
    title: "",
    calorie: 0,
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={value.title} onChange={handleChange}></input>
      <input
        type="number"
        min={0}
        name="calorie"
        value={value.calorie}
        onChange={handleChange}
      ></input>
      <textarea
        name="content"
        value={value.content}
        onChange={handleChange}
      ></textarea>
      <button type="submit">확인</button>
    </form>
  );
}

export default FoodForm;
