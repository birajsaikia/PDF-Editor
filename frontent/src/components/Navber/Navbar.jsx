import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
import { TfiMenu } from 'react-icons/tfi';
import { IoClose } from 'react-icons/io5';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css'; // Import CSS file

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="logo">
          <Link to={'/'}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="left">
          <div className={`menu ${menuOpen ? 'menu-open' : ''}`}>
            <ul className="menu-list">
              <li>
                <NavLink to={'/convert-pdf'}>CONVERT PDF</NavLink>
              </li>
              <li>
                <NavLink to={'/image-to-pdf'}>IMAGE TO PDF</NavLink>
              </li>
              <li>
                <NavLink to={'/merge-pdf'}>MERGE PDF</NavLink>
              </li>
              <li>
                <NavLink to={'/compress-pdf'}>COMPRESS PDF</NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-buttons">
            <Link to={'/login'}>
              <button className="signup-btn">Sign Up</button>
            </Link>
            {menuOpen ? (
              <IoClose className="menu-icon" onClick={toggleMenu} />
            ) : (
              <TfiMenu className="menu-icon" onClick={toggleMenu} />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
