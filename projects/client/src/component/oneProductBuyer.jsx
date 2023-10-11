import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../store/reducer/cartSlice";

export default function OneProductBuyer() {
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.cart);

  const addQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const reduceQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  // handle image error
  const handleImageError = (event) => {
    event.target.src =
      "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/product/${id}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.product.id === product.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(0);
    }
  }, [cartItems, product.id]);

  const isProductInCart = cartItems.some(
    (item) => item.product.id === product.id
  );

  console.log(cartItems);

  const handleSubmit = () => {
    if (!token) {
      navigate("/login");
    }
    if (quantity === 0 && isProductInCart) {
      axios
        .delete(`http://localhost:8000/api/user/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          axios
            .get("http://localhost:8000/api/user/cart", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              dispatch(updateCart(response.data.data));
              alert("Successfully removed from cart");
            })
            .catch((error) => {
              console.error("Failed to fetch cart data", error.message);
            });
        })
        .catch((error) => {
          console.error("Failed to remove from cart", error.message);
        });
    } else if (quantity > 0 && quantity <= product.stock) {
      axios
        .post(
          `http://localhost:8000/api/user/cart/${id}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          axios
            .get("http://localhost:8000/api/user/cart", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              dispatch(updateCart(response.data.data));
              alert("Successfully add to cart");
            })
            .catch((error) => {
              console.error("Failed to fetch cart data", error.message);
            });
        })
        .catch((error) => {
          console.error("Failed to add to cart", error.message);
        });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="outerbox">
        <div className="grid gap-10 grid-cols-1 grid-rows-1 m-4">
          <div className="font-josefin flex flex-wrap justify-center gap-2 sm:flex-row sm:flex-nowrap md:w-[49.2rem] md:mx-auto">
            <div className="imgstorecat flex flex-col w-full m-4">
              <img
                className="w-60 h-60 justify-center mx-auto m-2 object-cover"
                src={`http://localhost:8000${product.imgProduct}`}
                onError={handleImageError}
                alt="/"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="store text-left p-1">
                  {product.seller ? product.seller.store : ""}
                </div>
                <div className="category text-right p-1">
                  {product.category ? product.category.name : ""}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full m-4 text-left gap-2">
              <div className="text-2xl">{product.name}</div>
              <div className="flex">
                <div className="pr-3">
                  {product.price ? `Rp ${product.price.toLocaleString()}` : ""}
                </div>
                <div className="pl-3 border-l-2">{product.stock} Qty</div>
              </div>
              <div className="">{product.description}</div>
            </div>
          </div>
          <div className="addtocart flex mx-auto gap-2">
            <div className="flex justify-center">
              <div className="flex items-center border border-gray-300 px-3 py-2">
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={reduceQuantity}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <div className="flex items-center mx-3">
                  <div className="h-4 w-[0.05rem] bg-gray-300 mx-2"></div>
                  <div className="text-gray-700 font-medium px-2">
                    {quantity}
                  </div>
                  <div className="h-4 w-[0.05rem] bg-gray-300 mx-2"></div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={addQuantity}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex">
              <button
                className={`mx-auto w-32 py-2 text-xs font-josefin tracking-wide border ${
                  isProductInCart || quantity > 0
                    ? "bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={!isProductInCart && quantity === 0}
              >
                {isProductInCart && quantity === 0
                  ? "Remove from Cart"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
