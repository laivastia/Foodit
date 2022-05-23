import { useState } from "react";
import { createFood } from "../api";
import FileInput from "./FileInput";

function sanitize(type, value) {
  switch (type) {
    case "number":
      return Number(value) || 0;

    default:
      return value;
  }
}

const INITIAL_VALUES = {
  title: "",
  calorie: 0,
  content: "",
  imgFile: null,
};

function FoodForm({ onSubmitSuccess }) {
  const [isSubmittting, setIsSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(null);
  const [values, setValue] = useState(INITIAL_VALUES);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    handleChange(name, sanitize(type, value));
  };

  const handleChange = (name, value) => {
    setValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("calorie", values.calorie);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);

    let result;
    try {
      setIsSubmitting(true);
      setSubmittingError(null);
      result = await createFood(formData);
    } catch (error) {
      setSubmittingError(error);
    } finally {
      setIsSubmitting(false);
    }
    const { food } = result;
    onSubmitSuccess(food);
    setValue(INITIAL_VALUES);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FileInput
        name="imgFile"
        value={values.imgFile}
        onChange={handleChange}
      />
      <input
        name="title"
        value={values.title}
        onChange={handleInputChange}
      ></input>
      <input
        type="number"
        min={0}
        name="calorie"
        value={values.calorie}
        onChange={handleInputChange}
      ></input>
      <textarea
        name="content"
        value={values.content}
        onChange={handleInputChange}
      ></textarea>
      <button type="submit" disabled={isSubmittting}>
        확인
      </button>
      {submittingError?.message && <div>{submittingError.message}</div>}
    </form>
  );
}

export default FoodForm;
