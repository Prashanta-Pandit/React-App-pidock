import React, { useState, useEffect } from 'react';
import { CircleUserRound } from 'lucide-react';
import SignoutButton from '../SignOut/SignoutButton';

export default function ProfileTab() {

  const [isProfileTabClicked, setIsProfileTabClicked] = useState(false);
  
  // Toggle the profile tab visibility
  const showProfileTabWhenClicked = () => {
    setIsProfileTabClicked(!isProfileTabClicked);
  };
  
  // Hide the profile tab
  const hideProfileTab = () => {
    setIsProfileTabClicked(false);
  };

  return (
      <div className="relative inline-block">
        <CircleUserRound className="cursor-pointer" onClick={showProfileTabWhenClicked} />
        <div
          className={`absolute mt-2 right-0 bg-white p-4 rounded shadow-md transition-transform duration-300 ease-in-out ${
            isProfileTabClicked ? 'transform scale-100' : 'transform scale-0'
          }`}
          style={{ width: '250px', transformOrigin: 'top right', zIndex: 50 }}
        >
          <ul className="space-y-2 text-left">
            <li>
              <button
                className="w-full rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200 text-left"
                onClick={hideProfileTab}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="w-full rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200 text-left"
                onClick={hideProfileTab}
              >
                Manage Account
              </button>
            </li>
            <li>
              <button
                className="w-full rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200 text-left"
                onClick={hideProfileTab}
              >
                <SignoutButton />
              </button>
            </li>
          </ul>
        </div>
      </div>
  );
}




