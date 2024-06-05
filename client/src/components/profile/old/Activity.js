import React, { useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import "../../../styles/profile.css";
import Sidebar from "./Sidebar";
import TempHeader from "../../general/navbar/TempHeader";
import { Card, CardBody } from "@nextui-org/react";

const Profile = ({ isUserLoggedIn }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="profile-container">
      <TempHeader isUserLoggedIn={isUserLoggedIn} isBlackText={true} />
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <Card fullWidth="true" className="py-6">
            <CardBody className="overflow-visible flex-row">
              <div className="profile-image-container">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div className="pb-0 px-4 flex-col items-start">
                <h4 className="text-large font-bold">{user.displayName}</h4>
                <p className="text-default-500">
                  {user.userCity}, {user.userCountry}
                </p>
                <p className="text-small">{user.userBio}</p>
              </div>
            </CardBody>
          </Card>
        </div>
        <br />
        <Card>
          {" "}
          <CardBody>
            <p>HER KOMMER AKTIVITETEN.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
