import { useState } from "react";

function FoodForm() {
  const [title, setTitle] = useState("");
  const [calorie, setcalorie] = useState(0);
  const [content, setContent] = useState("");

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeCalorie = (e) => {
    const nextCalorie = Number(e.target.value) || 0;
    setcalorie(nextCalorie);
  };

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  return (
    <form>
      <input value={title} onChange={handleChangeTitle}></input>
      <input
        type="number"
        min={0}
        value={calorie}
        onChange={handleChangeCalorie}
      ></input>
      <textarea value={content} onChange={handleChangeContent}></textarea>
    </form>
  );
}

export default FoodForm;
