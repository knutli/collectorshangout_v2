import React, { useEffect } from "react";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

// Importing components
import LandingPage from "./components/LandingPage";
import LandingPage_NO from "./components/LandingPage_NO";
import Login from "./components/Login";
import AuctionView from "./components/auction/AuctionView";
import MainContent from "./components/content/MainContent";
import ArticlePage from "./components/content/ArticlePage";
import FAQModal from "./components/content/FAQModal";
import { AuthProvider } from "./AuthContext";
import AuctionCreatev2 from "./components/AuctionCreatev2";
import ProtectedRoute from "./components/ProtectedRoute";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <NextUIProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage_NO />} />
           {/*   <Route path="/login" element={<Login />} />

              <Route
                path="/auctioncreate"
                element={
                  <ProtectedRoute>
                    <AuctionCreatev2 />
                  </ProtectedRoute>
                }
              /> */}

              <Route path="/auction/:auctionId" element={<AuctionView />} />
              <Route path="/content" element={<MainContent />} />
              <Route path="/content/articles/:id" element={<ArticlePage />} />
              <Route path="/content/faq" element={<FAQModal />} />
            </Routes>
          </div>
        </Router>
      </NextUIProvider>
    </AuthProvider>
  );
}

export default App;
