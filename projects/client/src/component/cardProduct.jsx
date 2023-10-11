import { Pagination } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function AllProduct({ allProduct, currentPage, totalPages, onPageChange }) {
    // handle product by getting props from home

    const handleImageError = (event) => {
        event.target.src =
            "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
    };

    return (
        <>
            {allProduct.length === 0 ? (
                <div className="w-full font-josefin text-xl text-center mx-auto my-5">
                    No Product Found
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {allProduct.map((allProduct) => (
                            <div className="flex justify-around sm:flex-wrap gap-2 my-1 mx-auto sm:w-[15rem] md:w-[24rem]">
                                <Link to={`product/${allProduct.id}`}>
                                    <div
                                        className={`mx-auto bg-white w-full h-full flex flex-col text-jetblack p-2 hover:bg-flashwhite`}
                                    >
                                        <div className="w-full">
                                            <img
                                                className="w-20 h-20 justify-center mx-auto m-2 object-cover"
                                                src={`http://localhost:8000${allProduct.imgProduct}`}
                                                onError={handleImageError}
                                                alt="/"
                                            />
                                        </div>
                                        <div className="flex flex-col text-center gap-2 mt-2">
                                            <div className="flex-1 font-lora text-base">
                                                {allProduct.name}
                                            </div>
                                            <div className="font-josefin">
                                                {allProduct.category?.name}
                                            </div>
                                            <div className="font-lora text-xs mx-auto mt-3 h-full grow-0 w-full">
                                                <table className="mx-auto">
                                                    <tbody>
                                                        <tr>
                                                            <td className="border-r-2 border-gray-200 px-4">
                                                                {`Rp ${allProduct.price.toLocaleString("id-ID")}`}
                                                            </td>
                                                            <td className="px-4 overflow-auto">
                                                                {allProduct.stock} Qty
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <div className="m-4 p-4 flex font-ysa">
                <Pagination
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    showIcons
                    layout="pagination"
                    totalPages={totalPages}
                    nextLabel="Next"
                    previousLabel="Back"
                    className="mx-auto" />
            </div>
        </>
    );
}
