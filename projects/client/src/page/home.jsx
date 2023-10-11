import React, { useState, useEffect } from "react";
import NavBar from "../component/navbar";
import Header from "../component/header";
import Footer from "../component/footer";
import TopSelling from "../component/topselling";
import AllProduct from "../component/cardProduct";
import axios from "axios";

export default function Home() {
    const [allProduct, setAllProduct] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [sortAlphabet, setSortAlphabet] = useState('ASC');
    const [sortPrice, setSortPrice] = useState('ASC');
    const [selectCategory, setSelectCategory] = useState('');
    const [categories, setCategories] = useState([]);


    // handle search
    const handleSearchChange = (event) => {
        setCurrentPage(1)
        setSearchValue(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const formatCategoryId = event.target.value === 'All' ? '' : event.target.value;
        setCurrentPage(1)
        setSelectCategory(formatCategoryId)
    };

    const handleSortOrderAlphabet = (event) => {
        const sortOrder = event.target.value;
        setAllProduct([])
        setCurrentPage(1)
        setSortAlphabet(sortOrder)
    };

    const handleSortOrderPrice = (event) => {
        const sortOrder = event.target.value;
        setAllProduct([])
        setCurrentPage(1)
        setSortPrice(sortOrder)
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const onPageChange = (page) => {
        setAllProduct([]);
        setCurrentPage(page)
    }


    useEffect(() => {
        const product = axios.get(`http://localhost:8000/api/product?page=${currentPage}&search=${searchValue}&category=${selectCategory}&sortAlphabet=${sortAlphabet}&sortPrice=${sortPrice}`)
            .then(response => {
                if (response.data.data) {
                    setAllProduct(response.data.data)
                    const { totalData, perPage } = response.data.pagination;
                    setTotalPages(Math.ceil(totalData / perPage));
                } else {
                    setAllProduct([])
                }
            }).catch(error => {
                console.log(error.message)
            })

        axios.get("http://localhost:8000/api/product/category")
            .then(response => {
                setCategories(response.data.data);
            }).catch(error => {
                console.log(error.message);
            });
    }, [currentPage, searchValue, selectCategory, sortAlphabet, sortPrice]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <NavBar
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onAlphabetChange={handleSortOrderAlphabet}
                    onPriceChange={handleSortOrderPrice}
                    searchValue={searchValue}
                    categoryValue={selectCategory}
                    alphabetValue={sortAlphabet}
                    priceValue={sortPrice}
                    allCategory={categories}
                />
            </div>
            <div>
                <Header />
            </div>
            <div>
                <TopSelling />
            </div>
            <div>
                <AllProduct allProduct={allProduct} currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}