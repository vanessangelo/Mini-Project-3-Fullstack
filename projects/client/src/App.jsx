import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { keep } from './store/reducer/authSlice'
import Home from './page/home'
import SignUp from './page/signup'
import LogIn from './page/login'
import UserProfile from './page/userProfile'
import UserPurchase from './page/userPurchase'
import store from './store/index'
import UserStore from './page/userStore'
import UserCart from './page/userCart'
import SingleProductBuyer from './page/singleProductBuyer'
import ModifyProduct from './page/modifyProduct'
import { updateCart } from './store/reducer/cartSlice'
import axios from 'axios'


function App() {

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

function AppContent() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(keep(localStorage.getItem("token")));
      axios.get("http://localhost:8000/api/user/cart", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((response) => {
          dispatch(updateCart(response.data.data));
        })
    }
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/myprofile" element={<UserProfile />} /> 
        <Route path="/mystore" element={<UserStore />} />
        <Route path="/mypurchase" element={<UserPurchase />} />
        <Route path="/editproduct/:id" element={<ModifyProduct />} />
        <Route path="/mycart" element={<UserCart />} />
        <Route path="/product/:id" element={<SingleProductBuyer />} />
      </Routes>
    </Router>
  )
}

export default App;