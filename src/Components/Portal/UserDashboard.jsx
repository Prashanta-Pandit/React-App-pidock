import React, { useState, useEffect } from 'react';
import { fireStoreCollectionReference } from '../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

export default function UserDashboard() {
  const [signedInUserId, setSignedInUserId] = useState('');
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('signedInUserUid'); // this is user id that is stored after signing in from signin page. 
    if (userId) {
      setSignedInUserId(userId);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (signedInUserId) {
      const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // get the details in array.
        setUserDetails(details); 
        console.log(details);
      });
      return () => unsubscribe(); // Clean up the subscription on unmount
    }
  }, [signedInUserId]);  // Re-run this effect when signedInUserId changes

  return (
    <div className="mt-16 flex min-h-full flex-col justify-center px-12 py-12 lg:px-2">
      <h2 className="text-2xl font-semibold">
        {/** userdetails is an array now, if the array is greater than 0, and the searched item of array is always the matching user details. */}
        Welcome {userDetails.length > 0 ? userDetails[0].firstName : "loading...."} 
      </h2>
    </div>
  );
}
