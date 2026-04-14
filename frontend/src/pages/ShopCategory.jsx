import React, { useContext } from "react";
import "./css/shopcategory.css";
import { Shopcontext } from "../context/Shopcontext";
import Item from "../components/Items/Item";

const ShopCategory = ({ banner, category }) => {
  const context = useContext(Shopcontext);

  // Safe fallback
  const all_product = Array.isArray(context?.all_product)
    ? context.all_product
    : [];

  // Filtered products
  const filteredProducts = all_product.filter(
    (item) => item.category === category
  );

  return (
    <div className="shop-category">
      <img
        className="shopcategory-banner"
        src={banner}
        alt="category banner"
      />

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {filteredProducts.length}</span> out of{" "}
          {all_product.length} products
        </p>

        <div className="shopcategory-sort">
          Sort by
        </div>
      </div>

      <div className="shopcategory-products">
        {all_product.length === 0 ? (
          <h2>Loading Products...</h2>
        ) : filteredProducts.length === 0 ? (
          <h2>No products found in this category</h2>
        ) : (
          filteredProducts.map((item) => (
            <Item
              key={item.id || item._id}   // ✅ Important for MongoDB
              id={item.id || item._id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
