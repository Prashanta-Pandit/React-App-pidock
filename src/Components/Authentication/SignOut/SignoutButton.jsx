import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../FirebaseInitialisation';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

export default function SignoutButton() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // if no user found navigate to signout button.
            if (!user) {
                navigate('/signout'); // navigate to Signout page.
                console.log('Signed out Successfully');
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    function handleSignOutButton() {
        setLoading(true);
        signOut(auth).catch((error) => {
            // An error happened.
            console.error(error);
            setLoading(false);
        });
    }

    return (
        <div className='flex flex-row items-center' onClick={handleSignOutButton}>
            <span className="mx-2">{loading ? 'Signing Out...' : 'Sign Out'}</span>
        </div>
    );
}
