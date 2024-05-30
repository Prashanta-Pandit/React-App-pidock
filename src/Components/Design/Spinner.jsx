import React from 'react';

export default function Spinner(){
    return(
        <>
        <button 
             type="button" 
             className="bg-white text-xl font-bold text-gray-500 flex items-center justify-center" 
             disabled
            >
            <svg 
                className="animate-spin h-12 w-12 mr-4 text-gray-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
            <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                />
                <path 
                d="M4 12a8 8 0 018-8" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                />
            </svg>
           Processing...
         </button>
        </>
    )
}