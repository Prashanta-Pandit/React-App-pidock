import React, { useState } from 'react';
import { CircleUserRound, Headset, UserCog, LogOut, X } from 'lucide-react';
import SignoutButton from '../../Authentication/SignOut/SignoutButton';
import EditUserDetails from './EditUserDetails';
import Help from '../../TopNavBar/Help';
import SupportChat from './SupportChat';

export default function ProfileTab() {
  const [isProfileTabClicked, setIsProfileTabClicked] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const[isUpdateProfileClicked, setIsUpdateProfileClicked] = useState(false);
  const[isContactSupportClicked, setIsContactSupportClicked] = useState(false);

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
    setIsModelOpen(true);
    setIsUpdateProfileClicked(true);
    setIsContactSupportClicked(false);
  }

  function handleContactSupport() {
    hideProfileTab();
    setIsModelOpen(true);
    setIsContactSupportClicked(true);
    setIsUpdateProfileClicked(false);
  }

  function handleCloseModal() {
    setIsModelOpen(false);
  }

  return (
    <div className="relative inline-block mt-28">
      <div>
        <CircleUserRound className="cursor-pointer hover:text-gray-600" onClick={showProfileTabWhenClicked} />
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
                <span className="mx-2">Update Profile</span>
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

      {isModelOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-3 rounded-md shadow-md max-w-3xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-end">
                <X className=' cursor-pointer hover:bg-red-600 hover:text-white' onClick={handleCloseModal}/>
            </div>
            {/** If Update profile or Help clicked. */}
            {isUpdateProfileClicked && (<EditUserDetails />)}
            {isContactSupportClicked && 
                (<>
                  <div className="flex justify-end pt-4">
                     <Help />
                  </div>
                   <SupportChat />
                </>)
            }
          </div>
        </div>
      )}
      
      
    </div>
  );
}






