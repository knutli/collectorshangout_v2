import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../../AuthContext.js";
import { storage } from "../../../firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../../styles/profile.css";
import Sidebar from "./Sidebar";
import TempHeader from "../../general/navbar/TempHeader.js";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Pencil, Check } from "@phosphor-icons/react";

const Profile = ({ isUserLoggedIn }) => {
  const fileInputRef = useRef(null);
  const { user, setUser, isLoading } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    setEditedUser(user || {}); // Initialize editedUser with user data
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const handleSaveChanges = async () => {
    if (!editedUser.email || !editedUser.displayName) {
      alert("Email and name are required.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      setUser(updatedUser); // Update context or local state
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile.");
    }
  };

  const uploadProfileImage = async (file) => {
    if (!file) return null; // Handle the case where no file is provided
    const imageRef = ref(storage, `profile_images/${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // Early return if no file is selected

    try {
      const imageUrl = await uploadProfileImage(file); // Upload image and get URL
      const updatedUser = { ...user, photoURL: imageUrl }; // Update local user object

      // Send PUT request to update user on the server
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update user profile");

      const result = await response.json();
      setEditedUser(result); // Update local state with the new user data
      setUser(result); // Optionally update context or global user state if used
    } catch (error) {
      console.error("Error uploading image or updating user data:", error);
    }
  };

  return (
    <div className="profile-container">
      <TempHeader isUserLoggedIn={isUserLoggedIn} isBlackText={true} />
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <Card fullWidth="true" className="py-6">
            <CardBody className="overflow-visible flex-row">
              <div
                className="profile-image-container"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="profile-image"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
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
        <Card fullWidth="true" className="py-6 profile-section">
          <div className="section-header">
            <h2 className="font-bold text-large">Personlig informasjon</h2>

            {/* EDIT AND SAVE BUTTON */}
            <Button
              size="sm"
              variant="flat"
              onClick={() => {
                if (editMode) {
                  handleSaveChanges(); // Save the changes when in edit mode
                } else {
                  setEditMode(true); // Enable edit mode if not currently editing
                }
              }}
              startContent={
                editMode ? (
                  <Check size={20} color="green" />
                ) : (
                  <Pencil size={20} color="gray" />
                )
              }
            >
              {editMode ? "Lagre" : "Endre"}
            </Button>
          </div>

          <div className="profile-info-grid">
            {/*DISPLAY NAME*/}
            <div className="profile-info-field">
              Visningsnavn <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.displayName}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      displayName: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.displayName}</p>
              )}
            </div>

            {/*PHONE*/}
            <div className="profile-info-field">
              Telefon <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.phoneNumber}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.phoneNumber}</p>
              )}
            </div>

            {/*FIRST NAME*/}
            <div className="profile-info-field">
              Fornavn <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.firstName}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      firstName: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.firstName}</p>
              )}
            </div>

            {/*EMAIL*/}
            <div className="profile-info-field">
              Epost <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      email: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            {/*LAST NAME*/}
            <div className="profile-info-field">
              Etternavn <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.lastName}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      lastName: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.lastName}</p>
              )}
            </div>

            {/*BIO*/}
            <div className="profile-info-field">
              Bio <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.userBio}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      userBio: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.userBio}</p>
              )}
            </div>
          </div>
        </Card>
        <Card fullWidth="true" className="py-6 profile-section">
          <div className="section-header">
            <h2 className="font-bold text-large">Adresseinformasjon</h2>
            <Button
              size="sm"
              variant="flat"
              onClick={() => {
                if (editMode) {
                  handleSaveChanges(); // Save the changes when in edit mode
                } else {
                  setEditMode(true); // Enable edit mode if not currently editing
                }
              }}
              startContent={
                editMode ? (
                  <Check size={20} color="green" />
                ) : (
                  <Pencil size={20} color="gray" />
                )
              }
            >
              {editMode ? "Lagre" : "Endre"}
            </Button>
          </div>
          <div className="profile-info-grid">
            {/*COUNTRY*/}
            <div className="profile-info-field">
              Land <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.userCountry}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      userCountry: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.userCountry}</p>
              )}
            </div>

            {/*CITY*/}
            <div className="profile-info-field">
              By <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.userCity}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      userCity: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.userCity}</p>
              )}
            </div>

            {/*POSTCODE*/}
            <div className="profile-info-field">
              Postnummer <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.userPostcode}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      userPostcode: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.userPostcode}</p>
              )}
            </div>

            {/*ADDRESS*/}
            <div className="profile-info-field">
              Adresse <br />
              {editMode ? (
                <input
                  className="profile_edit_input"
                  type="text"
                  value={editedUser.userAddress}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      userAddress: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{user.userAddress}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
