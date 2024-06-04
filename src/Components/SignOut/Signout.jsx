import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Design/Spinner';

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
          <div className="mt-36 flex min-h-full justify-center px-6 py-12 lg:px-8">
              <Spinner />
          </div>
      ) : (
        <div className="mt-16 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
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
