import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image.png';



const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Local Logo"
                className="h-8"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Home</Link>
            <a href="https://www.consultadd.com/services/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Services</a>
            <a href="https://www.consultadd.com/about-us/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">About Us</a>
            <a href="https://www.consultadd.com/contact-us/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Contact</a>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <a href="tel:+1-646-461-7766" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              +1-646-461-7766
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
