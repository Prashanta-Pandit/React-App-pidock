import React, { useState, useEffect } from 'react'; // useState and useEffect hooks.
import SignoutButton from '../SignOut/SignoutButton';
import Spinner from '../Design/Spinner'

export default function Portal() {
  const [signedInUserId, setSignedInUserId] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('signedInUserUid'); // this is user id that is stored after signing in from signin page. 
    if (userId) {
      setSignedInUserId(userId);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
    <div className="mt-24 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <p>Your user id is: {signedInUserId}, & you are on the Portal now.</p>
          <SignoutButton />
          <Spinner />
    </div>
  </>
  );
}
