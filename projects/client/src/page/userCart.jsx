import Footer from "../component/footer"
import MyCart from "../component/user/contentCart"
import NavBar from "../component/navbar"
import withAuth from "../component/withAuth";

function UserCart() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <NavBar />
            </div>
            <div>
                <MyCart />
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}

export default withAuth(UserCart)