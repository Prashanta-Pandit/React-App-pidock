import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth} from '../FirebaseInitialisation';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import Spinner from '../Design/Spinner'
import { LogOut } from 'lucide-react'; 

export default function SignoutButton(){

    const[loading, setLoading] = useState(false);

    //use dom function, useNavigate() to naviagate to pages.
    const navigate = useNavigate();
    
    function handleSignOutButton(){

        setLoading(true);
        signOut(auth)
        .then(() => {
          
          localStorage.removeItem('signedInUserUid'); // removing the signed in unique user's id. 
          navigate('/signout'); // navigate to Signout page.
          console.log('Signed out Successfull')
    
        })
        .catch((error) => {
          // An error happened.
          console.error(error);
         });
      }

    return(
      <div className='flex flex-row items-center' onClick={handleSignOutButton}>
          <LogOut/>
          <span className="mx-2 text-sm font-medium">Sign Out</span>
      </div>
        )
}