import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Menu.css";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";

const Menu = () => {
  const { food_list, addToCart, url } = useContext(StoreContext);
  const [category, setCategory] = useState("All");

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  const categories = ["All", ...new Set(food_list.map(item => item.category))];

  const filteredFood = food_list.filter(item => {
    const matchCategory =
      category === "All" || item.category === category;

    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item._id);
    toast.success(`${item.name} added to cart 🛒`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  return (
    <div className="menu-page">
      <h2 className="menu-title">
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : "Explore Our Menu 🍽️"}
      </h2>

      {/* Categories */}
      <div className="menu-categories">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="menu-grid">
        {filteredFood.length > 0 ? (
          filteredFood.map(item => (
            <div className="menu-card" key={item._id}>
              <div className="menu-img-wrapper">
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                />
              </div>

              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="menu-card-footer">
                  <span className="price">₹{item.price}</span>
                  <button onClick={() => handleAddToCart(item)}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No items found 😕</h3>
            <p>Try searching something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
