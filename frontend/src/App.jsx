import { useState, useEffect } from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
// import "./App.css";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import routes from "@/routes";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function MainContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>{routes}</Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
