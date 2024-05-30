import { useNavigate } from 'react-router-dom';
import {auth} from '../FirebaseInitialisation';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

export default function SignoutButton(){

    //use dom function, useNavigate() to naviagate to pages.
    const navigate = useNavigate();
    
    function handleSignOutButton(){

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
        <div className="mt-10 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <button
              type="button"
              onClick={handleSignOutButton}
              className="rounded-md bg-black py-2 px-2 text-sm text-white font-bold shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Signout
            </button>
                
          </div>

        </div>

        </>
    )
}