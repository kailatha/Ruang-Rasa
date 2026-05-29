import { useEffect } from "react";
import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import routes from "@/routes";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider, useNotification } from "@/context/NotificationContext";
import { ToastContainer } from "@/components/ui/toast";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function ToastLayer() {
  const { toasts, dismissToast } = useNotification();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
}

function MainContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ScrollToTop />
      <Header />
      <ToastLayer />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>{routes}</Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <NotificationProvider>
          <MainContent />
        </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
}
