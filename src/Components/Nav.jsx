import React from 'react';

export default function Navbar() {

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 h-28 bg-gray-300">
        <div className="ml-2 flex max-w-7xl items-center justify-between py-5 sm:px-6 lg:px-8">
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
        </div>
      </div>
    </>
  );
}
