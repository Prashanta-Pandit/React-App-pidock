import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Spinner(){

    return(
        <>
        <button 
             type="button" 
             className="bg-white text-xl font-bold flex items-center justify-center" 
             style={{color: "#6b6b6b",}}
             disabled
            >
            <FontAwesomeIcon className='mr-5' icon={faSpinner} spinPulse size='2xl' style={{color: "#6b6b6b",}} />
           <span className="relative">Processing...</span>
         </button>
        </>
    )
}