import { Route, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/page";
import JournalPage from "@/pages/journal/page";
import ScreeningPage from "@/pages/screening/page";
// import ChatbotPage from "@/pages/chatbot/page";
import ProfilePage from "@/pages/profile/page";
import EditProfilePage from "@/pages/profile/edit/page";


// Simple auth guard — set DEV_BYPASS = false ketika auth sudah siap
const DEV_BYPASS = true;

function PrivateRoute({ children }) {
  if (DEV_BYPASS) return children;
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

const privateRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={<PrivateRoute><DashboardPage /></PrivateRoute>}
  />,
  <Route
    key="journal"
    path="/journal"
    element={<PrivateRoute><JournalPage /></PrivateRoute>}
  />,
  <Route
    key="screening"
    path="/screening"
    element={<PrivateRoute><ScreeningPage /></PrivateRoute>}
  />,
//   <Route
//     key="chatbot"
//     path="/chatbot"
//     element={<PrivateRoute><ChatbotPage /></PrivateRoute>}
//   />,
  <Route
    key="profile"
    path="/profile"
    element={<PrivateRoute><ProfilePage /></PrivateRoute>}
  />,
  <Route
    key="edit-profile"
    path="/profile/edit"
    element={<PrivateRoute><EditProfilePage /></PrivateRoute>}
  />,
];

export default privateRoutes;
