import { Route, Routes } from "react-router-dom";
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import HomePage from "../pages/home/HomePage";
import MainLayout from "../layout/MainLayout";
import SubscriptionList from "../pages/subscription/SubscriptionList";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/subscription" element={<SubscriptionList />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AllRoutes;
