import React, { useState, useEffect } from 'react'; // useState and useEffect hooks.
import SignoutButton from '../SignOut/SignoutButton';

export default function Portal() {
  const [signedInUserEmail, setSignedInUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('signedInUserEmail'); // this is user email that is stored after signing in from signin page. 
    if (email) {
      setSignedInUserEmail(email);
    }
  }, []); // Empty dependency array means this runs once on mount

  console.log('user in portal: ',signedInUserEmail); // Log the actual email

  return (
    <>
    <div className="mt-24 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <p>{signedInUserEmail}, you are on the Portal now.</p>
          <SignoutButton />
    </div>
  </>
  );
}
