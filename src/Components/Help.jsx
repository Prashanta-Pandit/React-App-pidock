import React, { useState } from 'react';
import { CircleHelp } from 'lucide-react'; // Ensure to import the CircleHelp icon from Lucid library

export default function Help() {
    const [isHelpTabClicked, setIsHelpTabClicked] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const showHelpTabWhenClicked = () => {
        setIsHelpTabClicked(!isHelpTabClicked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { name, email, message });
        setIsSubmitted(true);
    };

    return (
        <div className="relative inline-block">
            <CircleHelp className="cursor-pointer text-blue-500" onClick={showHelpTabWhenClicked} />
            <div
                className={`absolute mt-2 right-0 bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${
                    isHelpTabClicked ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
                }`}
                style={{ width: '350px', transformOrigin: 'top right', zIndex: 50 }}
            >
                <h3 className="mb-6 font-bold text-center text-black">Help Form</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-black">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-medium text-black">Message</label>
                        <textarea
                            id="message"
                            className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-200"
                    >
                        Submit
                    </button>
                </form>
                {isSubmitted && (
                    <div className="mt-4 text-center text-green-800">
                        We have received your message. 
                    </div>
                )}
            </div>
        </div>
    );
}




