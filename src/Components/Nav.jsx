import React, { useState } from 'react';

export default function Navbar() {
  // manage the menu toggle button in Small screen.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu(){
    setIsMenuOpen(!isMenuOpen);
  }
  return (
    <>
      <div className="fixed top-0 w-full bg-gray-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-1 py-2 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2">
            <span>
              <img
                src='/img/logo-trans.png'
                width="100"
                height="100"
                alt="logo"
              />
            </span>
          </div>
          <div className="hidden lg:block">
            <ul className="inline-flex space-x-8">
              <li>
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  About
                </a>
              </li>
              {/* Add more Items later: */}
            </ul>
          </div>
          <div className="hidden lg:block">
            {/* add any button here */}
          </div>
          <div className="lg:hidden">
            <svg
              onClick={toggleMenu}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 cursor-pointer"
            >
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden">
            <ul className="space-y-2 p-4">
              <li>
                <a
                  href="#"
                  className="block text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  About
                </a>
              </li>
              {/* Add more Items later: */}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
