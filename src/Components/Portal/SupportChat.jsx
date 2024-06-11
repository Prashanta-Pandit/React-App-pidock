import React, { useEffect, useState } from 'react';
import { LoaderCircle, Headset } from 'lucide-react'; 

export default function SupportChat() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [message, setMessage] = useState('');

    const containsNumber = (str) => /\d/.test(str);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (containsNumber(name)) {
            setErrorMessage('Name should not contain number.');
            return;
        }

        setIsSubmitted(true);
        console.log('Form submitted:', { name, email, message });
    };

    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                setIsSubmitted(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted]);

    return (
        <div
            className="relative bg-white p-6"
            style={{ width: '350px' }}
        >
            <div className="flex min-h-full flex-col justify-center">
                <div className="flex flex-row justify-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <Headset />
                    <h3 className=' ml-3 font-bold'>Chat online</h3>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div className="text-red-500 text-sm">{errorMessage}</div>
                        )}
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
                                    onChange={handleInputChange(setName)}
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
                                    onChange={handleInputChange(setEmail)}
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
                                    onChange={handleInputChange(setMessage)}
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

