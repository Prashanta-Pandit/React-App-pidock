import React, { useState } from 'react';
import Help from './Help';

export default function Navbar() {

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 h-24 bg-gray-300">
        <div className="ml-2 flex items-center justify-between py-5 px-5 sm:px-6 lg:px-8">
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
                  className=" cursor-pointer text-sm font-semibold text-black hover:text-gray-600"
                >
                  About
                </a>
              </li>
              <li>
                  <Help className="cursor-pointer"/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

