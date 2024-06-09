import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react'; // Ensure to import the CircleHelp icon from Lucid library

export default function SupportChat() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { name, email, message });
        setIsSubmitted(true);
    };

    return (
        <div
          className="relative bg-white p-6"
          style={{ width: '350px' }}
        >
            <div className="flex min-h-full flex-col justify-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h3 className="text-center font-bold leading-9 tracking-tight text-gray-900">
                        Chat online
                    </h3>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
                                    Message
                                </label>
                            </div>
                            <div className="mt-2">
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                    rows="4"
                                />
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
                                        <span>Getting Support...</span>
                                    </div>
                                ) : (
                                    "Chat"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
