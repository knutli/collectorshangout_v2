"use client";

import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Badge,
  Input,
  CardFooter,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AuthContext } from "../../../../AuthContext";
import { storage } from "../../../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Component(props) {
  const fileInputRef = useRef(null);
  const { user, setUser } = useContext(AuthContext);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    setEditedUser(user || {}); // Initialize editedUser with user data
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
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
      setUser(updatedUser);
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
    <Card className="max-w-xl p-2" {...props}>
      <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
        <p className="text-large">Rediger kontodetaljer</p>
        <div className="flex gap-4 py-4">
          <Badge
            disableOutline="true"
            classNames={{
              badge: "w-5 h-5",
            }}
            color="primary"
            content={
              <Button
                isIconOnly
                className="p-0 text-primary-foreground"
                radius="full"
                size="sm"
                variant="light"
                onClick={() => fileInputRef.current.click()} // Trigger file input click
              >
                <Icon icon="solar:pen-2-linear" />
              </Button>
            }
            placement="bottom-right"
            shape="circle"
          >
            <Avatar className="h-14 w-14" src={user.photoURL} />
          </Badge>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <div className="flex flex-col items-start justify-center">
            <p className="text-small text-default-400">
              Endre profilbildet ditt her. Dette bildet brukes til profilen din,
              og vil være synlig for andre brukere av plattformen.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Username */}
        <Input
          label="Brukernavn"
          labelPlacement="outside"
          placeholder="Legg inn brukernavn"
          name="username"
          value={editedUser.username || ""}
          onChange={handleChange}
        />
        {/* Email */}
        <Input
          label="Epost"
          labelPlacement="outside"
          placeholder="Legg inn epost"
          isRequired
          name="email"
          value={editedUser.email || ""}
          onChange={handleChange}
        />
        {/* First Name */}
        <Input
          label="Fornavn"
          labelPlacement="outside"
          placeholder="Legg inn fornavn"
          name="firstName"
          value={editedUser.firstName || ""}
          onChange={handleChange}
        />
        {/* Last Name */}
        <Input
          label="Etternavn"
          labelPlacement="outside"
          placeholder="Legg inn etternavn"
          name="lastName"
          value={editedUser.lastName || ""}
          onChange={handleChange}
        />
        {/* Phone Number */}
        <Input
          label="Telefon"
          labelPlacement="outside"
          placeholder="Legg inn ditt nummer"
          name="phoneNumber"
          value={editedUser.phoneNumber || ""}
          onChange={handleChange}
        />
        {/* Address */}
        <Input
          label="Adresse"
          labelPlacement="outside"
          placeholder="Legg inn adresse"
          name="address"
          value={editedUser.address || ""}
          onChange={handleChange}
        />

        {/* Zip Code */}
        <Input
          label="Postnummer"
          labelPlacement="outside"
          placeholder="Legg inn postnummer"
          name="postcode"
          value={editedUser.postcode || ""}
          onChange={handleChange}
        />

        {/* City */}
        <Input
          label="By"
          labelPlacement="outside"
          placeholder="Legg inn by"
          name="city"
          value={editedUser.city || ""}
          onChange={handleChange}
        />

        {/* Title */}
        <Input
          label="Tittel"
          labelPlacement="outside"
          placeholder="Legg inn tittel"
          name="title"
          value={editedUser.title || ""}
          onChange={handleChange}
        />

        {/* Bio */}
        <Input
          label="Bio"
          labelPlacement="outside"
          placeholder="Legg inn kort bio"
          name="bio"
          value={editedUser.bio || ""}
          onChange={handleChange}
        />
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button radius="full" variant="bordered">
          Avbryt
        </Button>
        <Button color="primary" radius="full" onClick={handleSaveChanges}>
          Lagre endringer
        </Button>
      </CardFooter>
    </Card>
  );
}
