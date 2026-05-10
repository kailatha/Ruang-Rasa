import { Route } from "react-router-dom";
import { HomePage, AboutPage } from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
import RegisterPage from "@/pages/register/page";

const publicRoutes = [
  <Route key="home" path="/" element={<HomePage />} />,
  <Route key="about" path="/about" element={<AboutPage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
];

export default publicRoutes;
