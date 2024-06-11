import React, { useState, useEffect } from 'react';
import { LoaderCircle, CircleHelp, X, CheckCircle } from 'lucide-react'; // Import CheckCircle for the tick icon

export default function Help() {
    const [isHelpTabClicked, setIsHelpTabClicked] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let timer;
        if (isSubmitted) {
            timer = setTimeout(() => {
                setIsSubmitted(false);
            }, 8000); // 8 sec
        }
        return () => clearTimeout(timer);
    }, [isSubmitted]);

    const showHelpTabWhenClicked = () => {
        setIsHelpTabClicked(true);
    };

    const handleCloseModal = () => {
        setIsHelpTabClicked(false);
    };

    const containsNumber = (str) => /\d/.test(str);
    const containsAlphabet = (str) => /[a-zA-Z]/.test(str);

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

        if (containsAlphabet(phone)) {
            setErrorMessage('Phone number only contains numbers.');
            return;
        }

        setIsSubmitted(true);
        console.log('Form submitted:', { name, email, phone, message });
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

                        {!isSubmitted ? (
                            <div className="flex min-h-full flex-col justify-center">
                                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                    <h3 className="text-center font-bold leading-9 tracking-tight text-gray-900">Send your message</h3>
                                </div>
                                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        {errorMessage && (
                                            <div className="text-red-500 text-sm">{errorMessage}</div>
                                        )}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                            </div>
                                            <div className="mt-2">
                                                <input type="text" required value={name} onChange={handleInputChange(setName)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                            </div>
                                            <div className="mt-2">
                                                <input type="email" required value={email} onChange={handleInputChange(setEmail)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">Phone</label>
                                            </div>
                                            <div className="mt-2">
                                                <input type="text" required value={phone} onChange={handleInputChange(setPhone)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label required className="block text-sm font-medium leading-6 text-gray-900">Message</label>
                                            </div>
                                            <div className="mt-2">
                                                <textarea type="text" required value={message} onChange={handleInputChange(setMessage)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"></textarea>
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
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <CheckCircle className="text-green-500 w-12 h-12 animate-bounce" />
                                <p className="text-center text-lg font-semibold text-gray-900">Your question is submitted, our team will contact you shortly.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}








