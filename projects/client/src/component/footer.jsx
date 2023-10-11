import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest, FaCopyright } from "react-icons/fa";
import { MdEmail } from "react-icons/md"

export default function Footer() {
    return (
        <div className="bg-darkgreen w-screen h-32 grid content-center">
            <div className="m-4 flex flex-col gap-5">
                <div className="basis-3/4 flex text-center justify-between">
                    <div className="p-2 basis-1/2">
                        <p className="text-babypowder font-bold mb-2 text-sm text-left font-josefin tracking-wide sm:text-center">FIND US ON</p>
                        <p className="flex gap-2 text-flashwhite sm:justify-center">
                            <a href="#" className="text-xl"><FaFacebookF className="text-sm sm:text-xl" /></a>
                            <a href="#" className="text-xl"><FaTwitter className="text-sm sm:text-xl" /></a>
                            <a href="#" className="text-xl"><FaInstagram className="text-sm sm:text-xl" /></a>
                            <a href="#" className="text-xl"><FaPinterest className="text-sm sm:text-xl" /></a>
                        </p>
                    </div>
                    <div className="p-2 basis-1/2">
                        <div>
                            <p className="text-babypowder font-semibold mb-2 leading-5 font-josefin">Get notify for our new products!</p>
                        </div>
                        <div className="flex content-center justify-center">
                            <input type="text" placeholder="john.doe@gmail.com" className="font-ysa text-xs w-40 h-5 outline-none focus:ring-2 focus:ring-lightgreen focus:ring-opacity-50"></input>
                            <button className=" bg-flashwhite w-5 h-5 text-base flex items-center justify-center outline-none"><MdEmail className="" /></button>
                        </div>
                    </div>
                </div>
                <div className="basis-1/4">
                    <p className="font-ysa text-babypowder text-xs text-center ">Copyright <FaCopyright className="text-xxs inline-block" /> 2023. All rights reserved</p>
                </div>
            </div>
        </div>
    )
}