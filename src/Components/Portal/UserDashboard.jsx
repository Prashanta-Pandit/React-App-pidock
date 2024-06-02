import React, { useState, useEffect } from 'react';

export default function UserDashboard() {
    const [signedInUserId, setSignedInUserId] = useState('');

    useEffect(() => {
      const userId = localStorage.getItem('signedInUserUid'); // this is user id that is stored after signing in from signin page. 
      if (userId) {
        setSignedInUserId(userId);
      }
    }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="mt-40 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <p>Your user id is: {signedInUserId}, & you are on the Dashboard now.</p>
    </div>
  );
}