import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";

export default function TopSelling() {
  const [topSelling, setTopSelling] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      fetchData();
      fetchCategories();
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setTopSelling([]);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/top_selling",
        { categoryId: selectedCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTopSelling(response.data.data);
    } catch (error) {
      console.error('Failed to get top selling products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/product/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to get categories:', error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="font-ysa">
      <div className="mb-4 flex justify-center sm:justify-start">
        <label htmlFor="category" className="mr-2">Select Category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange} className="bg-transparent h-6 p-0 px-2 text-sm focus:ring-0 focus:border focus:border-darkgreen">
          <option value="" className="font-ysa text-sm mt-1">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id} className="font-ysa text-sm">{category.name}</option>
          ))}
        </select>
      </div>
      {errorMsg && <div className="text-red-500 text-sm font-ysa">{errorMsg}</div>}
      {topSelling.length > 0 ? (
        <div>
          {topSelling.map((product, index) => (
            <div className="bg-white grid grid-cols-1 sm:grid-cols-2 p-4">
              <div key={index} className="flex gap-3 justify-center items-center">
                <div className="w-2/4">
                  <img src={`http://localhost:8000${product.product.imgProduct}`} alt={product.product.name} className="h-24 w-full object-cover" />
                  <p className="sm:text-center">{product.product.isActive ? 'Active' : 'Deactive'}</p>
                </div>
                <div className="grid grid-cols-1 font-ysa w-full">
                  <p>Name: {product.product.name}</p>
                  <p>Total Sold: {product.total_quantity} Qty</p>
                  <p>Price: Rp {Number(product.product.price).toLocaleString({ style: 'currency', currency: 'IDR' })}</p>
                  <p>Category: {product.product.Category.name}</p>
                  <p>Stock: {product.product.stock}</p>
                </div>
              </div>
              <div>
                <div>
                  Description:
                  <textarea
                    className="text-sm w-full p-1 border-none bg-transparent resize-none font-josefin break-words sm:text-base"
                    readOnly
                    value={product.product.description}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="pl-4">No top selling products found.</p>
      )}
    </div>
  );
}
