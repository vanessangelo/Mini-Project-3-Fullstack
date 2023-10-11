import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

export default function TopSelling() {
  const [topSelling, setTopSelling] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const token = useSelector((state) => state.auth.token);

  const scrollLeft = () => {
    document.getElementById("content").scrollLeft -= 400;
  };

  const scrollRight = () => {
    document.getElementById("content").scrollLeft += 400;
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/product/top-selling",
        { categoryId: selectedCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopSelling(response.data.data);
    } catch (error) {
      if (error.response.status === 400) {
        setTopSelling([]);
      }
      console.error("Failed to get top selling products:", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/product/category"
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to get categories:", error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      <div className="mb-3 bg-gray-100">
        <div className="font-josefin text-center py-4 text-xl font-medium">
          Top Selling!
        </div>
        <div className="font-josefin w-full flex justify-center items-center">
          Select Category:
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="h-8 w-40 py-0 pr-1 pl-3 mx-2 focus:ring-0 focus:border focus:border-darkgreen font-ysa text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex">
          <div className="text-left left-0 top-5 mx-4 grid">
            <button onClick={scrollLeft} className="text-xl text-jetblack">
              <IoIosArrowBack size={15} />
            </button>
          </div>
          <div
            id="content"
            className="carousel font-josefin py-4 flex items-center justify-start overflow-x-auto scroll-smooth scrollbar-hide w-full"
          >
            {topSelling.length > 0 ? (
              <div className="flex">
                {topSelling.map((item) => (
                  <Link to={`product/${item.product_id}`}>
                    <div className="group h-60 w-56 p-2 mx-1 hover:border-b-2 hover:cursor-pointer">
                      <div className="h-36 w-36 flex mx-auto mt-4">
                        <img
                          src={`http://localhost:8000${item.product.imgProduct}`}
                          alt={item.product.name}
                          className="h-36 w-36 object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify mt-3">
                        <div className="text-xl flex justify-center">
                          {item.product.name}
                        </div>
                        <div className="w-full flex price-sold opacity-0 group-hover:opacity-100 transition-opacity duration-300 justify-center text-sm">
                          <div className="basis-1/2 px-2 flex justify-center">
                            {item.product
                              ? `Rp ${item.product.price.toLocaleString()}`
                              : ""}
                          </div>
                          <div className="basis-1/2 px-2 flex justify-center">
                            {item.total_quantity} sold
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-60 w-full p-2 mx-1 flex justify-center">
                <p className="flex text-center justify-center">
                  No top selling products found
                </p>
              </div>
            )}
          </div>
          <div className="text-right right-0 top-5 mx-4 grid">
            <button onClick={scrollRight} className="text-xl text-jetblack">
              <IoIosArrowForward size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
