import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import "../../styles/profile.css";
import Sidebar from "./Sidebar";
import TempHeader from "../TempHeader";
import {
  Card,
  CardBody,
  Image,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalBody,
  useDisclosure,
  Input,
} from "@nextui-org/react";

const DeleteAccount = ({ isUserLoggedIn }) => {
  const { user, setUser, isLoading } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [confirmationText, setConfirmationText] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async (close) => {
    if (confirmationText === "SLETTKONTO") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.uid}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to delete account");
        close(); // Close the modal on successful deletion
        setUser(null); // Clear user context
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account.");
      }
    } else {
      alert("Vennligst skriv SLETTKONTO for å slette din konto.");
    }
  };

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
          <>
            <CardBody>
              <p>
                Obs: Alt av bilder, budhistorikk, auksjoner, din samling og din
                personinformasjon vil slettes.{" "}
              </p>
              <br />
              <p>
                Kontoen din kan <strong>IKKE</strong> gjenopprettes, og
                handlingen er irreversibel.
              </p>
              <br />
            </CardBody>
            <Button
              color="danger"
              auto
              variant="ghost"
              onClick={onOpen}
              disabled={isLoading || !user}
            >
              Slett min konto
            </Button>
            <Modal isOpen={isOpen} onClose={onOpenChange}>
              <ModalContent>
                {(close) => (
                  <>
                    <ModalHeader>
                      <p>Bekreft sletting av konto</p>
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Vennligst skriv inn <strong>SLETTKONTO</strong> for å
                        bekrefte.
                      </p>

                      <Input
                        clearable
                        bordered
                        fullWidth
                        color="error"
                        size="lg"
                        placeholder="Skriv SLETTKONTO her"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        auto
                        variant="light"
                        onClick={() => handleDeleteAccount(close)}
                      >
                        Bekreft slett konto
                      </Button>
                      <Button auto onClick={close} color="danger">
                        Avbryt
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccount;
