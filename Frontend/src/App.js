import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import Products from "./Pages/Products/Products";
import SpecificCategory from "./Pages/Products/SpecificCategory";
import ShoeManager from "./Pages/Shoes/ShoeManager";
import AdminUsers from "./Pages/Admin/AdminUsers";
import Landing from "./Pages/Landing/Landing";
import OrderList from "./Pages/Orders/OrderList";
import OrderDetail from "./Pages/Orders/OrderDetail";
import Cart from "./Pages/Cart/Cart";
import ProductDetails from "./Pages/Products/ProductDetails/ProductDetails";
import "./App.css";
import CartCheckout from "./Pages/Cart/CartCheckout";
import Login from "./Pages/Login/Login";
import UserProfile from "./Pages/User/UserProfile";
import axios from "axios";
import Register from "./Pages/Register/Register";
import ProtectedRoutesAdmin from "./ProtectedRoutes/ProtectedRoutesAdmin";
import ProtectedRoutesUser from "./ProtectedRoutes/ProtectedRoutesUser";
import { CartDrawerProvider } from "./Components/CartDrawer/CartDrawerContext";
import CartDrawer from "./Components/CartDrawer/CartDrawer";
axios.defaults.withCredentials = true;

function App() {
  return (
    <CartDrawerProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route element={<ProtectedRoutesUser />}>
          <Route path="/home" element={<Home />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/category/:SpecificCategory" element={<SpecificCategory />} />
          <Route element={<ProtectedRoutesAdmin />}>
            <Route path="/shoes" element={<ShoeManager />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/Product/:id" element={<ProductDetails />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/CartCheckout" element={<CartCheckout />} />
          <Route path="/Profile" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <CartDrawer />
    </CartDrawerProvider>
  );
}

export default App;
