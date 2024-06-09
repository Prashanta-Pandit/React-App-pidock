import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';

export default function Signout() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  // useEffect to render the loading spinner once when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  function handleSignInAgainButton() {
    navigate('/');
  }

  return (
    <>
      {loading ? (
          // Show loading spinner while 'loading' state is true
        <div className="mt-36 flex flex-row items-center justify-center px-6 py-12 lg:px-8 space-x-4">
           <LoaderCircle className='animate-spin w-12 h-12 text-red-500 font-semibold' />
        <span className="relative text-lg text-gray-500 font-semibold">Signing you out...</span>
     </div>
      ) : (
        <div className="flex min-h-screen flex-col justify-center items-center px-6 py-8 lg:px-8">
          <p>You are signed out.</p>
          <button
            onClick={handleSignInAgainButton}
            className="font-light underline text-black hover:text-slate-700 focus:outline-none mt-4"
          >
           Sign in again
          </button>
        </div>
      )}
    </>
  );
}
