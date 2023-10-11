import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updateCart, clearCart } from "../../store/reducer/cartSlice";

export default function MyCart() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cart);

  const token = useSelector((state) => state.auth.token);
  // handle image error
  const handleImageError = (event) => {
    event.target.src =
      "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
  };

  const addQuantity = (productId, currentQuantity, stock) => {
    if (currentQuantity <= stock) {
      const updatedQuantity = currentQuantity + 1;
      axios
        .post(
          `http://localhost:8000/api/user/cart/${productId}`,
          { quantity: updatedQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          axios
            .get("http://localhost:8000/api/user/cart", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              dispatch(updateCart(response.data.data));
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

  const reduceQuantity = (productId, currentQuantity) => {
    if (currentQuantity >= 0) {
      const updatedQuantity = currentQuantity - 1;
      axios
        .post(
          `http://localhost:8000/api/user/cart/${productId}`,
          { quantity: updatedQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          axios
            .get("http://localhost:8000/api/user/cart", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              dispatch(updateCart(response.data.data));
            })
            .catch((error) => {
              console.error("Failed to fetch cart data", error.message);
            });
        })
        .catch((error) => {
          console.error("Failed to reduce quantity", error.message);
        });
    }
  };

  // handle address
  const initialValues = {
    address: "",
  };

  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
  });

  const handleToggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleCloseModal = (e) => {
    setModalOpen(false);
  };

  const handleRemoveCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get("http://localhost:8000/api/user/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data.length === 0) {
        dispatch(clearCart());
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        dispatch(updateCart(response.data.data));
      }
    } catch (error) {
      console.error("Failed to remove from cart", error.message);
    }
  };

  const handleSubmit = async (values, { resetForm, setStatus }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/checkout",
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        resetForm();
        setStatus({ success: true, message: "Successfully purchased." });
        dispatch(clearCart());
        setSuccessMessage("Successfully purchased.");
        setErrorMessage("");
        setTimeout(() => {
          handleCloseModal();
          alert("Successfully purchased.");
        }, 2000);
      }
    } catch (error) {
      if (error?.response?.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className="mx-auto text-center font-josefin mt-5 text-xl">
        MY CART
      </div>
      <div className="flex-col gap-1">
        <div className="title grid grid-flow-col m-5 grid-cols-3 font-ysa text-xl">
          <div className="col-start-1 col-end-3">Product</div>
          <div className="col-start-3 col-end-4 px-2">Total</div>
        </div>
        {cartItems.map((item) => {
          const totalPrice = item.quantity * item.product.price;
          return (
            <div className="grid grid-flow-col m-5 grid-cols-3 py-2 border-b-2">
              <div className="col-start-1 col-end-3 flex gap-3 flex-wrap md:flex-nowrap font-josefin">
                <div className="img flex">
                  <img
                    className="w-24 h-24 justify-center mx-auto m-2 object-cover sm:w-40 sm:h-40"
                    src={`http://localhost:8000${item.product.imgProduct}`}
                    onError={handleImageError}
                    alt="/"
                  />
                </div>
                <div className="grid w-full items-end">
                  <div className="flex-col items-end h-fit">
                    <div className="text-base sm:text-xl">
                      {item.product.name}
                    </div>
                    <div className="text-base sm:text-l">
                      {`Rp ${item.product.price.toLocaleString()}`}
                    </div>
                    <div className="sm:flex font-ysa">
                      <div className="w-fit flex items-center border border-gray-300 px-1 py-1 mt-2">
                        <button
                          className={`text-gray-500 hover:text-gray-700 focus:outline-none`}
                          onClick={() =>
                            reduceQuantity(item.product.id, item.quantity)
                          }
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
                        <div className="flex items-center mx-2">
                          <div className="h-4 w-[0.05rem] bg-gray-300 mr-1"></div>
                          <div className="text-gray-700 font-medium px-2">
                            {item.quantity}
                          </div>
                          <div className="h-4 w-[0.05rem] bg-gray-300 ml-1"></div>
                        </div>
                        <button
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() =>
                            addQuantity(
                              item.product.id,
                              item.quantity,
                              item.product.stock
                            )
                          }
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
                      <div className="w-fit font-josefin text-xs grid items-end px-1 hover:underline">
                        <button
                          type="submit"
                          onClick={() => handleRemoveCart(item.product.id)}
                        >
                          remove from cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-start-3 col-end-4 px-2 font-josefin text-xs flex items-end sm:text-base">
                Rp {totalPrice.toLocaleString()}
              </div>
            </div>
          );
        })}
        <div className="font-maitree">
          <div className="grid grid-flow-col m-5 grid-cols-3 text-sm sm:text-base">
            <div className="col-start-1 col-end-3 text-right px-2">
              Total Price:
            </div>
            <div className="col-start-3 col-end-4 px-2">
              Rp{" "}
              {cartItems
                .reduce(
                  (total, item) => total + item.quantity * item.product.price,
                  0
                )
                .toLocaleString()}
            </div>
          </div>
        </div>
        <div className="px-5">
          <button
            className={`w-full py-2 my-4 text-xs font-josefin tracking-wide border ${
              cartItems.length === 0
                ? "bg-gray-300 cursor-not-allowed opacity-50"
                : "bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
            }`}
            onClick={handleToggleModal}
          >
            Proceed to Payment
          </button>
        </div>
        <div>
          <Modal
            show={modalOpen}
            size="md"
            popup={true}
            onClose={handleCloseModal}
          >
            <Modal.Header>
              <span className="text-base font-lora px-2 sm:text">
                One More Step to Checkout
              </span>
            </Modal.Header>
            <Modal.Body>
              <div className="font-josefin space-y-3 pb-4 sm:px-6 sm:pb-6 lg:px-8 xl:pb-8">
                <div className="flex flex-col gap-2">
                  <div className="text-gray-900 dark:text-white text-sm sm:text-base">
                    Cart Summary
                  </div>
                  {cartItems.map((item) => {
                    const totalPrice = item.quantity * item.product.price;
                    return (
                      <div className="text-sm flex w-full">
                        <div className="basis-3/6 px-1">
                          {item.product.name}
                        </div>
                        <div className="basis-1/6 px-1">x {item.quantity}</div>
                        <div className="basis-2/6 px-1">
                          {`Rp ${totalPrice.toLocaleString()}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      <Form>
                        <div className="grid grid-flow-row gap-1 justify-center">
                          <div className="grid grid-flow-row gap-3 w-60">
                            <div>
                              <label
                                htmlFor="address"
                                className="font-josefin text-sm"
                              >
                                Address:
                              </label>
                              <Field
                                type={"text"}
                                id="address"
                                name="address"
                                className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                                placeholder="Enter your address here."
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="text-red-500 text-sm px-2 mt-1"
                              />
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            <button
                              className="w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                              type="submit"
                              disabled={submit}
                              onClick={handleSubmit}
                            >
                              Checkout
                            </button>
                            {successMessage && (
                              <div className="text-green-500 mt-2">
                                {successMessage}
                              </div>
                            )}
                            {errorMessage && (
                              <div className="text-red-500 mt-2">
                                {errorMessage}
                              </div>
                            )}
                            <button
                              type="button"
                              className="w-full py-2 mt-3 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
}
