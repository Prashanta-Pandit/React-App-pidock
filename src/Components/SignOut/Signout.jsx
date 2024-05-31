import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Signout(){
   
   const navigate = useNavigate();
   function handleSignInAgainButton(){
       navigate('/');
   }
   
   return(
      <>
        <div className="mt-40 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
              <p>You are signed out.</p>
              <button
              onClick={handleSignInAgainButton}
              className="font-light underline text-black hover:text-slate-700 focus:outline-none mt-4" 
            >
              back to Sign in
            </button>
        </div>

      </>
   )
}