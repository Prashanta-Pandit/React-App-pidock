import React from 'react';
import {useNavigate} from 'react-router-dom';

import { UserX } from 'lucide-react';

 function UserNotSignedIn() {
    
    const navigate = useNavigate();
    const handleSignInButton = () =>{
        navigate('/');
    }
    return(
        <div className="flex min-h-screen flex-col justify-center items-center px-6 py-8 lg:px-8">
           <UserX className='size-16 my-7 animate-bounce'/>
          <p>No user found. Please sign in to continue.</p>
          <button
                  onClick={handleSignInButton}
                  className="font-light underline text-black hover:text-slate-700 focus:outline-none mt-4"
                >
                 Sign In
                </button>
        </div>
      )

 }

export default UserNotSignedIn;
