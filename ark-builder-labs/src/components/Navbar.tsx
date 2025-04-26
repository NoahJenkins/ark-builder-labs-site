import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

function Navbar({ mobileMenuOpen, toggleMobileMenu }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">ARK BUILDER LABS</span>
        </Link>
        
        <div className="menu-icon" onClick={toggleMobileMenu}>
          <div className={`menu-icon-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`menu-icon-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`menu-icon-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
        </div>
        
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={toggleMobileMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={toggleMobileMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
