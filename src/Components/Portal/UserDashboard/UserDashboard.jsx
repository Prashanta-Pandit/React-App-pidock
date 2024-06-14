import React, { useState, useEffect } from 'react';
import { fireStoreCollectionReference } from '../../FirebaseInitialisation';
import { onSnapshot, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { LoaderCircle } from 'lucide-react';
import EmployeesList from './ItemsInDashboard/EmployeeList';

export default function UserDashboard() {
  const [signedInUserId, setSignedInUserId] = useState('');
  const [userDetails, setUserDetails] = useState([]); // the data receiver from Firebase is as a JSON format.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('signedInUserUid'); // Get the user ID from local storage
    if (userId) {
      setSignedInUserId(userId);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchData = async () => {
      if (signedInUserId) {
        try {
          const q = query(fireStoreCollectionReference, where("userLoginId", "==", signedInUserId));
          const querySnapshot = await getDocs(q); // Fetch the documents asynchronously
          const details = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // Map the document data to an array
          setUserDetails(details);
        } catch (error) {
          console.error("Error fetching user details: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData(); // run the fetchData function.
  }, [signedInUserId]); // Re-run this effect when signedInUserId changes

  return (
    <div className="mt-32 ml-6 flex flex-col justify-center px-4 py-6 lg:px-2">
      <h2 className="text-2xl font-semibold mb-4 ml-3">
        {loading ? <LoaderCircle className="text-gray-300 animate-spin" /> : `Welcome ${userDetails[0]?.firstName || ''}`}
      </h2>
      <EmployeesList />
    </div>
  );
}



