import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";

const Header = ({ isUserLoggedIn }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="z-10 absolute top-0 left-0 w-full text-white body-font bg-black bg-opacity-50">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <a href="/auctioncreate" className="mr-5 hover:text-gray-300">
            Create auction
          </a>
          <a href="#faq" className="mr-5 hover:text-gray-300">
            FAQ
          </a>
          {isUserLoggedIn ? (
            <div className="relative">
              <button onClick={toggleMenu} className="focus:outline-none">
                {/* Placeholder for the profile icon */}
                <img
                  src="path/to/placeholder-profile.jpg"
                  alt="Profile"
                  className="h-8 w-8 rounded-full cursor-pointer"
                />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#logout"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Log Out
                  </a>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="mr-5 hover:text-gray-300">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
