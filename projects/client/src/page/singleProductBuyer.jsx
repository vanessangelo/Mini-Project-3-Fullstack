import NavBar from "../component/navbar"
import Footer from "../component/footer"
import OneProductBuyer from "../component/oneProductBuyer"

export default function SingleProductBuyer() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div>
        <OneProductBuyer />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}