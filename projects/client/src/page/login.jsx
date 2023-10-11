import LoginUser from "../component/user/loginUser"
import NavBar from "../component/navbar"
import Footer from "../component/footer"

export default function LogIn() {
  return (
  <div className="flex flex-col min-h-screen">
    <div className="sticky top-0 z-50">
      <NavBar/>
    </div>
    <div>
      <LoginUser/>
    </div>
    <div className="mt-auto">
      <Footer/>
    </div>
  </div>
  )
}