import NavbarDashboard from "../component/user/navbarDashboard"
import Footer from "../component/footer"
import MyStore from "../component/user/contentStore"
import withAuth from "../component/withAuth";

function UserStore() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <NavbarDashboard />
            </div>
            <div>
                <MyStore />
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}

export default withAuth(UserStore);