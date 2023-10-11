import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";

export default function StoreCategory() {
    const token = useSelector((state) => state.auth.token)

    //handle accordian
    const [activeTab, setActiveTab] = useState('create');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    // handle new category
    const initialValuesNew = {
        name: ""
    };

    const validationSchemaNew = Yup.object().shape({
        name: Yup.string().required('Category name is required'),
    });

    const handleSubmitNew = async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/product/category', values, { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 201) {
                resetForm();
                setStatus({ success: true, message: 'Successfully add new category!' });
            }

        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                const { errors } = response.data;
                const errorMessage = errors[0].msg;
                setStatus({ success: false, message: errorMessage });
            }

            if (response.status === 500) {
                setStatus({ success: false, message: "Internal Server Error" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    // handle modify
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [allCategory, setAllCategory] = useState([])
    const [pickCategory, setPickCategory] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCategory = (id, name) => {
        const formatId = id + "";
        const formatName = name + "";
        setPickCategory(formatId);
        setSelectedCategory(formatName)
    }

    const closeDropdowns = () => {
        setIsDropdownOpen(false);
    };

    const handleSubmitModify = async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/user/category/${pickCategory}`, values, { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 201) {
                resetForm();
                setStatus({ success: true, message: 'Successfully changed!' });
            }

        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                const { errors } = response.data;
                const errorMessage = errors[0].msg;
                setStatus({ success: false, message: errorMessage });
            }

            if (response.status === 404) {
                setStatus({ success: false, message: "Category not found" })
            }

            if (response.status === 500) {
                setStatus({ success: false, message: "Internal Server Error" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (token) {
            const userCategories = axios.get("http://localhost:8000/api/user/category", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    setAllCategory(response.data.data)
                }).catch(error => {
                    console.log(error.message)
                })
        }
    }, [token, activeTab])

    return (
        <>
            <div>
                <button
                    type="button"
                    className={`h-10 flex items-center justify-between w-full font-ysa tracking-wide py-5 text-left ${activeTab === "create"
                        ? "text-darkgreen dark:text-darkgreen border-b border-darkgreen dark:border-darkgreen"
                        : "text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
                        }`}
                    onClick={() => handleTabClick("create")}
                >
                    <span>Create New Category</span>
                    <svg
                        className={`w-6 h-6 ${activeTab === "create" ? "rotate-180" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
                {activeTab === "create" && (
                    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <Formik initialValues={initialValuesNew} validationSchema={validationSchemaNew} onSubmit={handleSubmitNew}>
                                {({ isSubmitting, status }) => (
                                    <Form>
                                        <div className='grid grid-flow-row gap-1 justify-center'>
                                            <h3 className='text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-sm'>Input the name of the new category below:</h3>
                                            <div className='w-full grid grid-flow-row gap-3 font-ysa'>
                                                {status && status.success && (
                                                    <p className="font-ysa text-sm text-center text-greenn">{status.message}</p>
                                                )}
                                                {status && !status.success && (
                                                    <p className="font-ysa text-sm text-center text-redd">{status.message}</p>
                                                )}
                                                <div className='font-ysa relative mt-4'>
                                                    <ErrorMessage name='name' component='div' className='text-redd text-xs absolute -top-5' />
                                                    <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='name' placeholder='insert here' />
                                                </div>
                                            </div>
                                            <button
                                                className='w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen'
                                                type='submit'
                                                disabled={isSubmitting}
                                            >
                                                Create My Category
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    className={`h-10 flex items-center justify-between w-full font-ysa tracking-wide py-5 font-medium text-left ${activeTab === "modify"
                        ? "text-darkgreen dark:text-darkgreen border-b border-darkgreen dark:border-darkgreen"
                        : "text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
                        }`}
                    onClick={() => handleTabClick("modify")}
                >
                    <span>Modify Your Category</span>
                    <svg
                        className={`w-6 h-6 ${activeTab === "modify" ? "rotate-180" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
                {activeTab === "modify" && (
                    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <div className="relative mx-5">
                                <button id="dropdown-button" onClick={toggleDropdown} className="font-yosefin text-justify text-s w-full z-50 inline-flex place-items-stretch px-2 py-1 text-sm font-medium text-jetblack border border-gray-300 hover:bg-white focus:outline-none focus:bg-white focus:border-darkgreen" type="button">
                                    <span className="font-josefin">
                                        {selectedCategory ? selectedCategory : "Select one:"}
                                    </span>
                                    <span className="text-right ml-auto">
                                        <svg aria-hidden="true" className={`{w-4 h-4 flex-shrink-0 self-center ${isDropdownOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </button>
                                <div id="dropdown" className={`bg-white divide-y w-full divide-gray-100 dark:bg-gray-700 z-10 absolute ${isDropdownOpen ? 'block' : 'hidden'}`} style={{ maxHeight: '150px', overflowY: 'auto' }} >
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                        {allCategory.map((result) => {
                                            return (
                                                <li>
                                                    <button key={result.id} type="button" onClick={() => { handleCategory(result.id, result.name); closeDropdowns() }} className="font-ysa inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{result.name}</button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-10">
                                <Formik initialValues={initialValuesNew} validationSchema={validationSchemaNew} onSubmit={handleSubmitModify}>
                                    {({ isSubmitting, status }) => (
                                        <Form>
                                            <div className='grid grid-flow-row gap-1 justify-center'>
                                                <h3 className='text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-sm'>Set new name for the category:</h3>
                                                <div className='w-full grid grid-flow-row gap-3 font-ysa'>
                                                    {status && status.success && (
                                                        <p className="font-ysa text-sm text-center text-greenn">{status.message}</p>
                                                    )}
                                                    {status && !status.success && (
                                                        <p className="font-ysa text-sm text-center text-redd">{status.message}</p>
                                                    )}
                                                    <div className='font-ysa relative mt-4'>
                                                        <ErrorMessage name='name' component='div' className='text-redd text-xs absolute -top-5' />
                                                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='name' placeholder='insert here' />
                                                    </div>
                                                </div>
                                                <button
                                                    className='w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen'
                                                    type='submit'
                                                    disabled={isSubmitting}
                                                >
                                                    Modify My Category
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}