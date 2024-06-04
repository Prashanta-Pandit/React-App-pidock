import React, { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import ProfileTab from './Portal/ProfileTab';

export default function Navbar() {

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 h-24 bg-gray-300">
        <div className="ml-2 flex items-center justify-between py-5 sm:px-6 lg:px-8">
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
          <div className='ml-auto'>
            <ul className="inline-flex space-x-8">
              <li>
                <a
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  About
                </a>
              </li>
              <li>
                <button
                  className=" text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  <CircleHelp />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

