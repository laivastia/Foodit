import FoodList from "./FoodList";
import { useEffect, useState } from "react";
import { getFoods } from "../api";
import FoodForm from "./FoodForm";

function App() {
  const [items, setItems] = useState([]);
  const [order, setOder] = useState("createdAt");
  const [cursor, setCursor] = useState();
  const [isLoding, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [search, setSearch] = useState("");

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOder("createdAt");
  const handleCalorieClick = () => setOder("calorie");

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(e.target["search"].value);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getFoods(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }

    const {
      foods,
      paging: { nextCursor },
    } = result;
    if (!options.cursor) {
      setItems(foods);
    } else {
      setItems((prevItems) => [...prevItems, ...foods]);
    }
    setCursor(nextCursor);
  };

  const handleLoadMore = () => {
    handleLoad({ order, cursor, search });
  };

  const handleSubmitSuccess = (food) => {
    setItems((prevItems) => [food, ...prevItems]);
  };

  useEffect(() => {
    handleLoad({ order, search });
  }, [order, search]);

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleCalorieClick}>칼로리순</button>
      </div>
      <FoodForm onSubmitSuccess={handleSubmitSuccess} />
      <form onSubmit={handleSearchSubmit}>
        <input name="search" />
        <button type="submit">검색</button>
      </form>
      <FoodList items={sortedItems} onDelete={handleDelete} />
      {cursor && (
        <button disabled={isLoding} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;
