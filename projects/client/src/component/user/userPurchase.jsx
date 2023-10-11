import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/api/user/purchase");
      setPurchases(response.data.purchases);
    };

    fetchData();
  }, []);

  return (
    <div className="font-ysa flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-darkgreen mb-4">Purchase History</h1>
      {purchases.map((purchase, index) => (
        <div key={index} className="border p-4 rounded shadow mb-4 w-1/2">
          <h2 className="text-xl font-bold text-darkgreen mb-2">Order #{purchase.orderDetail.id}</h2>
          <p>Total Price: {purchase.orderDetail.totalPrice}</p>
          <p>Address: {purchase.orderDetail.address}</p>
          <p>Order Date: {new Date(purchase.orderDetail.createdAt).toLocaleDateString()}</p>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-darkgreen mb-2">Items:</h3>
            {purchase.items.map((item, index) => (
              <div key={index} className="flex justify-between border p-2 rounded mb-2">
                <div>
                  <p className="font-lora">Product: {item.product.name}</p>
                  <p className="font-lora">Category: {item.product.category}</p>
                  <p className="font-lora">Quantity: {item.quantity}</p>
                </div>
                <div>
                  <img src={`http://localhost:8000${item.product.imgProduct}`} alt={item.product.name} className="h-24 w-24 object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseHistory;