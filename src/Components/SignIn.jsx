import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'; // this helps to navigate to the other pages. 

//import from firebase
import { auth } from './FirebaseInitialisation';
import { signInWithEmailAndPassword, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

export default function SignIn(){

    //****************************************************** */
    const navigate = useNavigate(); // use navigate 

    // handle navigation to create account page.
    function handleCreateAccount(){
        navigate('./register');  // this is a path for Registration Page in the App.jsx
    }
    
    //handle navigation to forgot password page.
    function handleForgotPassword(event){
        event.preventDefault(); // Prevents the default form submission
        navigate('./forgotPassword');
    }

    // handle redirection to Portal after a signin and storing users details in local Storage.
    function redirectToPortal(signedInUser){
        
        localStorage.setItem('signedInUserEmail', signedInUser.email)
        navigate('/portal');
    
    }
    /********************************************************* */


    /********************************************************** */
    //detect the user who is logged in and havent signed out. Redirect the page directly to portal, and skip the signin page. 
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, pass user info and redirect
            redirectToPortal(user);
        } else {
            // User is signed out
            console.log('No user is signed in.');
        }
    });

    /*********************************************************** */

    //use useState :
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //handle Sigin button and authenticate on firebase.
    function handleSignInOnSubmit(e){
       e.preventDefault();
       signInWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
           // Signed in
           const user = userCredential.user;
           console.log('User logged in:', user);
           // redirect user to Portal and passdown the user details on it.
           redirectToPortal(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorCode, errorMessage);
            // Display error message to user
            if (errorCode === 'auth/invalid-credential') {
                alert('invalid email or password.');
            }
      });
    }
    
    return(
        <>
            <div className="mt-10 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {/* handle the onsubmit on form. */}
                    <form className="space-y-6" onSubmit={handleSignInOnSubmit}>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                            </div>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" autoComplete="current-email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <button 
                                    className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                                    onClick={handleForgotPassword}
                                >
                                    forgot password?
                                </button>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                        </div>
                    </form>
                    <button 
                        className="font-light text-black hover:text-slate-700 focus:outline-none mt-4" 
                        onClick={handleCreateAccount}
                    >
                        Create account
                    </button>
                </div>
            </div>
        </>
    )
}
