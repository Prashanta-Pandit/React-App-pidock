import { useNavigate } from 'react-router-dom';
import {auth} from '../FirebaseInitialisation';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

export default function SignoutButton(){
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
            <button
              type="button"
              onClick={handleSignOutButton}
              className="rounded-md bg-black mt-20 ml-80 mr-80 px-3 py-2 text-sm text-white font-bold shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Signout
            </button>
        </>
    )
}