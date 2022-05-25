import FoodList from "./FoodList";
import { useEffect, useState } from "react";
import { createFood, deleteFood, getFoods, updateFood } from "../api";
import FoodForm from "./FoodForm";
import LocaleContext from "../contexts/LocaleContext";
import LocaleSelect from "./LocaleSelect";

function App() {
  const [locale, setLocale] = useState("ko");
  const [items, setItems] = useState([]);
  const [order, setOder] = useState("createdAt");
  const [cursor, setCursor] = useState();
  const [isLoding, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [search, setSearch] = useState("");

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOder("createdAt");
  const handleCalorieClick = () => setOder("calorie");

  const handleDelete = async (id) => {
    const result = await deleteFood(id);
    if (!result) return;

    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
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

  const handleCreateSuccess = (food) => {
    setItems((prevItems) => [food, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ order, search });
  }, [order, search]);

  return (
    <LocaleContext.Provider value={locale}>
      <div>
        <LocaleSelect value={locale} onChange={setLocale} />
        <div>
          <button onClick={handleNewestClick}>최신순</button>
          <button onClick={handleCalorieClick}>칼로리순</button>
        </div>
        <FoodForm onSubmit={createFood} onSubmitSuccess={handleCreateSuccess} />
        <form onSubmit={handleSearchSubmit}>
          <input name="search" />
          <button type="submit">검색</button>
        </form>
        <FoodList
          items={sortedItems}
          onDelete={handleDelete}
          onUpdate={updateFood}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {cursor && (
          <button disabled={isLoding} onClick={handleLoadMore}>
            더 보기
          </button>
        )}
        {loadingError?.message && <span>{loadingError.message}</span>}
      </div>
    </LocaleContext.Provider>
  );
}

export default App;
