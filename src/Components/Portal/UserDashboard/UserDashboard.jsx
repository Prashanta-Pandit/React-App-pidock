import React, { useState, useEffect } from 'react';
import { fireStoreCollectionReference } from '../../FirebaseInitialisation';
import { onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { LoaderCircle } from 'lucide-react';
import TeamList from './CardsForDashboard/TeamList';

export default function UserDashboard() {
  const [signedInUserId, setSignedInUserId] = useState('');
  const [userDetails, setUserDetails] = useState([]); // the data receiver from Firsbase is as a JSON format.

  useEffect(() => {
    const userId = localStorage.getItem('signedInUserUid'); // Get the user ID from local storage
    if (userId) {
      setSignedInUserId(userId);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (signedInUserId) {
      const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const details = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // Map the document data to an array
        setUserDetails(details);
      });
      return () => unsubscribe(); // Clean up the subscription on unmount
    }
  }, [signedInUserId]); // Re-run this effect when signedInUserId changes

  return (
    <div className="mt-32 ml-6 flex flex-col justify-center px-4 py-6 lg:px-2">
      <h2 className="text-2xl font-semibold mb-4">
        {userDetails.length > 0 ? `Welcome ${userDetails[0].firstName}` : <LoaderCircle className="text-gray-300 animate-spin" />}
      </h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {userDetails.map(user => (
          <TeamList key={user.id} firstName={user.firstName} lastName={user.lastName} email={user.email} />
        ))}
      </div>
    </div>
  );
}


