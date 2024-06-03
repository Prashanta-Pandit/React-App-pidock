import React, { useEffect, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import SignoutButton from '../SignOut/SignoutButton';

export default function ProfileTab() {

  const [isProfileTabClicked, setIsProfileTabClicked] = useState(false);
  
  // make the tab active when clicked, and if the tab is active , diactive after a click again.
  const showProfileTabWhenClicked = () => {
    setIsProfileTabClicked(!isProfileTabClicked);
  };
  
  //disappear tab when clicked. 
  const hideProfileTab = () => {
    setIsProfileTabClicked(false);
  };

  return (
    <div className="relative inline-block">
      <CircleUserRound className='cursor-pointer' onClick={showProfileTabWhenClicked} />
      <div
        className={`absolute mt-2 right-0 bg-white p-4 rounded shadow-md transition-transform duration-300 ease-in-out ${
          isProfileTabClicked ? 'transform scale-100' : 'transform scale-0'
        }`}
        style={{ width: '250px', transformOrigin: 'top right' }}
      >
        <ul className="space-y-2 text-left">
          <li className="rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200" onClick={hideProfileTab}>Profile</li>
          <li className="rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200" onClick={hideProfileTab}>Manage Account</li>
          <li className="rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200" onClick={hideProfileTab}><SignoutButton/></li>
        </ul>
      </div>
    </div>
  );
}



