import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import "../../styles/header.css";

const TempHeader = ({ isBlackText }) => {
  const { user, signOut } = useContext(AuthContext);
  const headerClass = isBlackText
    ? "header-container black-text"
    : "header-container";

  // Redirect to previous page after login
  const handleLoginClick = () => {
    localStorage.setItem("preLoginUrl", window.location.pathname);
    window.location.href = "/login";
  };

  return (
    <header className="header-background">
      <div className={headerClass}>
        <nav>
          <Link to="/" className="hover:text-gray-300">
            Hjem
          </Link>

          <Link to="/content" className="hover:text-gray-300">
            Blogg
          </Link>

          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  size="sm"
                  radius="md"
                  isBordered
                  as="button"
                  className="transition-transform"
                  src={user.photoURL} // Use the user's photo URL
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                disabledKeys={["profile", "settings"]}
              >
                <DropdownItem key="info" className="h-14 gap-2">
                  <p className="font-semibold">Innlogget som</p>
                  <p className="font-semibold">{user.displayName}</p>
                  <p>{user.email}</p>
                </DropdownItem>
                <DropdownItem key="createauction" as={Link} to="/auctioncreate">
                  Opprett auksjon
                </DropdownItem>
                <DropdownItem key="profile" as={Link} to="/profile">
                  Profil
                </DropdownItem>
                <DropdownItem key="settings" as={Link} to="/settings">
                  Innstillinger
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={signOut}>
                  Logg ut
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link to="/login" className="hover:text-gray-300">
              Logg inn
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default TempHeader;
