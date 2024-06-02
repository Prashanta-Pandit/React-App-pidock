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
        <>
        {
          loading ? (
            <div className="mt-36 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
               <Spinner />
            </div>

          ):(
            <>
              <div className='flex flex-row' onClick={handleSignOutButton}>
                 <LogOut/>
                 <span className="mx-2 text-sm font-medium">Sign Out</span>
              </div>
            </>
          )
        }
        </>
    )
}