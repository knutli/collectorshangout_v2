import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Min profil
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collection"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Min samling
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/activity"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Min aktivitet
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notifications"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Varslinger
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/billing"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Betaling
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/delete-account"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Slett konto
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
