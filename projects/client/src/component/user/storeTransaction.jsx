import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from 'moment';

export default function StoreTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (startDate && endDate) {
            if (!validateDates()) return;
            fetchData();
        }
    }, [startDate, endDate]);

    const validateDates = () => {
        if (moment(endDate).isBefore(moment(startDate)) || moment(endDate).diff(moment(startDate), 'days') > 7) {
            setErrorMsg("The end date must be within 7 days of the start date and after the start date.");
            return false;
        }
        setErrorMsg("");
        return true;
    };

    const fetchData = async () => {
        setTransactions([]);

        try {
            const requestBody = {
                startDate: startDate,
                endDate: endDate
            };

            const response = await axios.post("http://localhost:8000/api/user/transaction", requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data);
            console.log(response.data, "test")
        } catch (error) {
            console.error('Failed to get user purchases:', error);
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const maxStartDate = moment().subtract(30, 'days').format('YYYY-MM-DD');

    return (
        <div className="font-josefin">
            <h1 className="text-base text-center font-josefin mb-4 text-jetblack tracking-wide mt-6 sm:text-2xl">Transaction History</h1>
            {errorMsg && <div className="text-red-500">{errorMsg}</div>}
            <div className="flex flex-col gap-3 pl-4 sm:flex-row justify-center">
                <div className="">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate || ""}
                        min={maxStartDate}
                        max={endDate || moment().format('YYYY-MM-DD')}
                        onChange={handleStartDateChange}
                        className="mx-2 text-sm py-0 focus:ring-0 focus:border focus:border-jetblack"
                    />
                </div>
                <div className="mb-4">
                    <label className="mr-[0.4rem] sm:mr-0">End Date:</label>
                    <input
                        type="date"
                        value={endDate || ""}
                        min={startDate || moment().subtract(30, 'days').format('YYYY-MM-DD')}
                        max={moment().format('YYYY-MM-DD')}
                        onChange={handleEndDateChange}
                        className="mx-2 text-sm py-0 focus:ring-0 focus:border focus:border-jetblack"
                    />
                </div>
            </div>
            {transactions.length > 0 ? (
                <div>
                    <h3 className="text-lg font-bold text-darkgreen mb-2 pl-4 font-ysa">
                        Transaction History between {moment(startDate).format("MMMM DD, YYYY")} and {moment(endDate).format("MMMM DD, YYYY")}
                    </h3>
                    {transactions.map((transaction) => (
                        <div className="border p-4 rounded shadow mb-4">
                            <h4 className="font-bold">Order #{transaction.orderDetail_id}</h4>
                            <p className="">Order Date: {moment(transaction.product.createdAt).format("MMM DD, YYYY")} </p>
                            {transaction.product.map((item) => (
                                <>
                                    <hr />
                                    <h5 className="font-bold">Items:</h5>
                                    <div className="border p-2 rounded mb-2 flex gap-3">
                                        <img src={`http://localhost:8000${item.product.imgProduct}`} alt={item.product.name} className="h-24 w-24 object-cover hidden sm:block" />
                                        <div className="grid grid-cols-1 gap-2 items-center">
                                            <p>Product: {item.product.name}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: {item.product.price ? `Rp ${(item.product.price).toLocaleString()}` : ""}</p>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No transaction history found for the selected date range.</p>
            )}
        </div>
    );
}
