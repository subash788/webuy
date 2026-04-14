import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrum from "../components/Breadcrums/Breadcrum";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay";
import { Shopcontext } from "../context/Shopcontext";

const Product = () => {
  const { all_product } = useContext(Shopcontext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = all_product.find(
    (item) => item.id === Number(productId)
  );

  const startChat = () => {
    navigate("/chat", {
      state: {
        roomId: productId, // product-based chat room
      },
    });
  };

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />

      {/* 🔹 Chat with Seller Button */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={startChat}
          style={{
            padding: "12px 25px",
            backgroundColor: "#ff4141",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Chat with friends
        </button>
      </div>

      {/* <Popular /> */}
    </div>
  );
};

export default Product;
