import { useContext, useState } from "react";
import LocaleContext from "../contexts/LocaleContext";
import FoodForm from "./FoodForm";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

function FoodListItem({ item, onDelete, onEdit }) {
  const handleDeleteClick = () => onDelete(item.id);

  const locale = useContext(LocaleContext);

  const handleEditClick = () => {
    onEdit(item.id);
  };

  return (
    <div className="ReviewListItem">
      <img className="ReviewListItem-img" src={item.imgUrl} alt={item.title} />
      <div className="FoodListItem">
        <h1>{item.title}</h1>
        <p>칼로리 : {item.calorie}</p>
        <p>{formatDate(item.createdAt)}</p>
        <p>{item.content}</p>
        <p>현재 언어 : {locale}</p>
        <button onClick={handleDeleteClick}>삭제</button>
        <button onClick={handleEditClick}>수정</button>
      </div>
    </div>
  );
}
function FoodList({ items, onDelete, onUpdate, onUpdateSuccess }) {
  const [editingId, setEdititngId] = useState(null);

  const handleCancel = () => setEdititngId(null);

  return (
    <ul className="FoodList">
      {items.map((item) => {
        if (item.id === editingId) {
          const { id, imgUrl, title, calorie, content } = item;
          const initialValues = { title, calorie, content };

          const handleSubmit = (formData) => onUpdate(id, formData);

          const handleSubmitSuccess = (newItem) => {
            onUpdateSuccess(newItem);
            setEdititngId(null);
          };

          return (
            <li key={item.id}>
              <FoodForm
                initialValues={initialValues}
                initialPreview={imgUrl}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </li>
          );
        }
        return (
          <li key={item.id}>
            <FoodListItem
              item={item}
              onDelete={onDelete}
              onEdit={setEdititngId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default FoodList;
