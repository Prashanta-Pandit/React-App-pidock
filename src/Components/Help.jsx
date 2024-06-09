import React, { useState } from 'react';
import { LoaderCircle, CircleHelp, X } from 'lucide-react'; // Ensure to import the CircleHelp icon from Lucid library

export default function Help() {
    const [isHelpTabClicked, setIsHelpTabClicked] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const showHelpTabWhenClicked = () => {
        setIsHelpTabClicked(true);
    };

    const handleCloseModal = () => {
        setIsHelpTabClicked(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { name, email, message });
        setIsSubmitted(true);
    };

    return (
        <div className="relative inline-block">
            <CircleHelp className="cursor-pointer text-black hover:text-gray-600" onClick={showHelpTabWhenClicked} />
            {isHelpTabClicked && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    style={{ zIndex: 50 }}
                >
                    <div
                        className="relative bg-white p-6 rounded-lg shadow-lg"
                        style={{ width: '350px' }}
                    >
                        <div className="flex justify-end">
                            <X className="cursor-pointer hover:bg-red-600 hover:text-white" onClick={handleCloseModal} />
                        </div>

                        <div className="flex min-h-full flex-col justify-center">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <h3 className="text-center font-bold leading-9 tracking-tight text-gray-900">Help form</h3>
                            </div>

                            <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                        </div>
                                        <div className="mt-2">
                                            <input id="email" name="email" type="email" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                        </div>
                                        <div className="mt-2">
                                            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Message</label>
                                        </div>
                                        <div className="mt-2">
                                            <textarea type="text" required value={message} onChange={(e) => setMessage(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                                            </textarea>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-black"
                                            >
                                            {isSubmitted ? (
                                                <div className="flex items-center space-x-2">
                                                <LoaderCircle className="animate-spin" />
                                                <span>Submitting...</span>
                                                </div>
                                            ) : (
                                                "Submit"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {isSubmitted && (
                             <div className="mt-4 text-center text-green-800">
                                 We have received your message.
                             </div>
                         )}
                </div>
            </div>
            )}
        </div>
    );
}






