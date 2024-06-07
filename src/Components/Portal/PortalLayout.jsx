import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import SideNavBar from './SideNavBar';
import ProfileTab from './ProfileTab';
import { auth } from '../FirebaseInitialisation';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

export default function Dashboard() {
  // State to manage loading spinner visibility
  const [loading, setLoading] = useState(true);
  
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // useEffect to handle loading spinner
  useEffect(() => {
    // Set a timer to hide the spinner after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // useEffect to handle Firebase authentication state changes
  useEffect(() => {
    // Set up a listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If no user is authenticated, navigate to the user not signed in page
      if (!user) {
        navigate('/usernotsignedin');
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [navigate]); // Dependency array with 'navigate'

  return (
    <>
      {loading ? (
        // Show loading spinner while 'loading' state is true
        <div className="mt-36 flex flex-row items-center justify-center px-6 py-12 lg:px-8 space-x-4">
           <LoaderCircle className='animate-spin w-12 h-12 text-red-500 font-semibold' />
           <span className="relative text-lg text-gray-500 font-semibold">Connecting to server...</span>
        </div>
      
      ) : (
        // Show the main content once 'loading' state is false
        <div className="flex">
          <SideNavBar className="flex-shrink-0" />
          <div className="flex-grow flex justify-end pr-8">
            <ProfileTab />
          </div>
        </div>
      )}
    </>
  );
}


