import React from 'react';
import NavBar from '../component/navbar';
import SignupUser from '../component/user/signupUser';
import Footer from "../component/footer"

export default function SignUp() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>
            <div>
                <SignupUser />
            </div>
            <div className='mt-auto'>
                <Footer />
            </div>
        </div>
    );
}
