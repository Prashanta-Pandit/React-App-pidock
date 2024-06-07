import React, { useState } from 'react';
import { CircleUserRound, Headset, UserCog, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignoutButton from '../SignOut/SignoutButton';

export default function ProfileTab() {
  const [isProfileTabClicked, setIsProfileTabClicked] = useState(false);
  const navigate = useNavigate();

  // Toggle the profile tab visibility
  const showProfileTabWhenClicked = () => {
    setIsProfileTabClicked(!isProfileTabClicked);
  };

  // Hide the profile tab
  const hideProfileTab = () => {
    setIsProfileTabClicked(false);
  };

  function handleManageAccount() {
    hideProfileTab();
    navigate("/portal/edituserdetails");
  }

  function handleContactSupport() {
    hideProfileTab();
    // Assuming there's navigation or action for contacting support
    navigate("/portal/contactsupport"); // Adjust this to the correct path or action
  }

  return (
    <div className="relative inline-block mt-28">
      <CircleUserRound className="cursor-pointer" onClick={showProfileTabWhenClicked} />
      <div
        className={`absolute mt-2 right-0 bg-white p-2 rounded shadow-md transition-transform duration-300 ease-in-out ${
          isProfileTabClicked ? 'transform scale-100' : 'transform scale-0'
        }`}
        style={{ width: '250px', transformOrigin: 'top right', zIndex: 50 }}
      >
        <ul className="space-y-2 text-left font-normal text-sm">
          <li>
            <button
              className="w-full flex flex-row justify-start rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200 text-left"
              onClick={handleManageAccount}
            >
              <UserCog /> 
              <span className="mx-2">Manage Account</span>
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-row justify-start rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200 text-left"
              onClick={handleContactSupport}
            >
              <Headset /> 
              <span className="mx-2">Contact Support</span>
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-row justify-start rounded-lg p-2 transition-colors duration-300 hover:text-black hover:bg-gray-200 text-left"
              onClick={hideProfileTab}
            >
              <LogOut />
              <SignoutButton />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}





