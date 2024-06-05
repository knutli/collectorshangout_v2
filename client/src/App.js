import React, { useEffect } from "react";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

// Importing components
import LandingPage from "./components/general/LandingPage";
import LandingPage_NO from "./components/general/LandingPage_NO";
import Login from "./components/general/Login";
import AuctionView from "./components/auction/AuctionView/AuctionView";
import MainContent from "./components/content/MainContent";
import ArticlePage from "./components/content/ArticlePage";
import FAQModal from "./components/content/FAQModal";
import { AuthProvider } from "./AuthContext";
import AuctionCreatev2 from "./components/auction/AuctionCreate/AuctionCreatev2";
import ProtectedRoute from "./components/general/ProtectedRoute";
import AuctionsPage from "./components/auction/AuctionListings/AuctionsPage";
import Profil from "./components/profile/old/Profil";
import Collection from "./components/profile/old/Collection";
import Activity from "./components/profile/old/Activity";
import Notifications from "./components/profile/old/Notifications";
import Billing from "./components/profile/old/Billing";
import DeleteAccount from "./components/profile/old/DeleteAccount";
import ProfileArea from "./components/profile/old/ProfileArea";
import MainSidebar from "./components/profile/new/sidebar/MainSidebar";

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
              <Route path="/login" element={<Login />} />
              <Route
                path="/auctioncreate"
                element={
                  <ProtectedRoute>
                    <AuctionCreatev2 />
                  </ProtectedRoute>
                }
              />
              <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/auction/:auctionId" element={<AuctionView />} />
              <Route path="/content" element={<MainContent />} />
              <Route path="/content/articles/:id" element={<ArticlePage />} />
              <Route path="/content/faq" element={<FAQModal />} />
              <Route path="/profile" element={<Profil />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/experimental" element={<MainSidebar />} />
            </Routes>
          </div>
        </Router>
      </NextUIProvider>
    </AuthProvider>
  );
}

export default App;
