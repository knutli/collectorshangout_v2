import React from "react";
import Sidebar from "./Sidebar";
import TempHeader from "../../general/navbar/TempHeader";

const ProfileArea = ({ children }) => {
  return (
    <div>
      <TempHeader isUserLoggedIn={true} isBlackText={true} />
      <div className="profile-container">
        <Sidebar />
        <div className="profile-content">{children}</div>
      </div>
    </div>
  );
};

export default ProfileArea;
