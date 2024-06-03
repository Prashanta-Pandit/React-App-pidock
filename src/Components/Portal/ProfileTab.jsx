import React, { useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import SignoutButton from '../SignOut/SignoutButton';

export default function ProfileTab() {
  const [isTabClicked, setIsTabClicked] = useState(false);

  const showTabWhenClicked = () => {
    setIsTabClicked(!isTabClicked);
  };

  const hideTab = () => {
    setIsTabClicked(false);
  };

  return (
    <div className="relative inline-block">
      <CircleUserRound className={`cursor-pointer ${isTabClicked ? "bg-gray-400" : ""}`} onClick={showTabWhenClicked} />

      <div
        className={`absolute mt-2 right-0 bg-white p-4 rounded shadow-md transition-transform duration-300 ease-in-out ${
          isTabClicked ? 'transform scale-100' : 'transform scale-0'
        }`}
        style={{ width: '250px', transformOrigin: 'top right' }}
      >
        <ul className="space-y-2 text-left">
          <li className="rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200" onClick={hideTab}>Profile</li>
          <li className="rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200" onClick={hideTab}>Manage Account</li>
          <li className="rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200" onClick={hideTab}><SignoutButton/></li>
        </ul>
      </div>
    </div>
  );
}



