import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/browser-logo.png";
import add_song_icon from "../assets/add_song.png";
import song_icon from "../assets/song_icon.png";
import add_album_icon from "../assets/add_album.png";
import album_icon from "../assets/album_icon.png";

const navItems = [
  { to: "/add-song", icon: add_song_icon, label: "Add Song" },
  { to: "/list-songs", icon: song_icon, label: "List Songs" },
  { to: "/add-album", icon: add_album_icon, label: "Add Album" },
  { to: "/list-albums", icon: album_icon, label: "List Albums" },
];

const Sidebar = () => (
  <>
    {/* Desktop / Tablet Sidebar */}
    <aside className="hidden md:flex bg-gray-900 text-white w-64 min-h-screen flex-col items-center py-8">
      <div className="mb-12">
        <img src={logo} alt="Logo" className="w-20 h-22 mx-auto" />
      </div>
      <nav className="w-full space-y-2 px-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "hover:bg-gray-800 text-gray-300"
              }`
            }
          >
            <img src={icon} alt={label} className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Mobile Bottom Navigation */}
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white md:hidden flex justify-around items-center py-2 shadow-inner">
  {navItems.map(({ to, icon, label }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center text-xs transition-colors duration-200 ${
          isActive ? "text-teal-400" : "text-gray-400 hover:text-white"
        }`
      }
    >
      <img
        src={icon}
        alt={label}
        className="w-6 h-6 mb-1 filter brightness-0 invert"
      />
      <span>{label.split(" ")[0]}</span>
    </NavLink>
  ))}
</nav>

  </>
);

export default Sidebar;
