import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@nextui-org/react";
import "../../../styles/header.css";
import NotificationsCard from "./notifications-card";

const TempHeader = ({ isBlackText }) => {
  const { user, signOut } = useContext(AuthContext);
  const headerClass = isBlackText
    ? "header-container black-text"
    : "header-container";
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLoginClick = () => {
    localStorage.setItem("preLoginUrl", window.location.pathname);
    window.location.href = "/login";
  };

  return (
    <header className="header-background">
      <div className={headerClass}>
        {isMobile ? (
          <nav className="mobile-nav">
            <Link to="/auctions" className="mobile-nav-link">
              Auksjoner
            </Link>
            <Link to="/auctioncreate" className="mobile-nav-link">
              Opprett auksjon
            </Link>
            <Link to="/profile" className="mobile-nav-link">
              Profil
            </Link>
          </nav>
        ) : (
          <nav>
            <Link to="/" className="hover:text-gray-300">
              Hjem
            </Link>

            <Link to="/auctions" className="hover:text-gray-300">
              Auksjoner
            </Link>

            <Link to="/content" className="hover:text-gray-300">
              Blogg
            </Link>

            {user ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="mt-1 h-8 w-8 outline-none transition-transform">
                    <Badge
                      className="border-transparent"
                      color="success"
                      content=""
                      placement="bottom-right"
                      shape="circle"
                      size="sm"
                    >
                      <Avatar
                        size="sm"
                        isBordered
                        color="success"
                        src={user.photoURL}
                      />
                    </Badge>
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  disabledKeys={["settings"]}
                >
                  <DropdownItem key="info" className="h-14 gap-2">
                    <p className="font-semibold">Innlogget som</p>
                    <p className="font-semibold">{user.displayName}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="createauction"
                    as={Link}
                    to="/auctioncreate"
                  >
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
        )}
      </div>
    </header>
  );
};

export default TempHeader;
