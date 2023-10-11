import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <>
            <div
                className="bg-cover bg-center w-full h-60 grid content-center pl-6"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1533900298318-6b8da08a523e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFya2V0fGVufDB8fDB8fHww&w=1000&q=80")',
                }}
            >
            </div>
        </>
    )
}