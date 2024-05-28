import React from 'react';

export default function Navbar (){
    return (
        <>
        <div className="relative w-full bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
            <div className="inline-flex items-center space-x-2">
                <span>
                    <img
                        src='/img/logo-trans.png'
                        width="100"
                        height="100"
                        alt="logo"
                    />
                </span>
            </div>
            <div className="hidden lg:block">
            <ul className="inline-flex space-x-8">
                <li>
                <a
                    href="#"
                    className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                    Home
                </a>
                </li> 
                <li>
                <a
                    href="#"
                    className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                    About
                </a>
                </li> 
                {/*Add more Items later: */}
            </ul>
            </div>
            <div className="hidden lg:block">
            <button
                type="button"
                className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                Help
            </button>
            </div>
            <div className="lg:hidden"> {/*For nav bae in small screen */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 cursor-pointer"
              >
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </div>
        </div>
        </div>
        </>
    )
}