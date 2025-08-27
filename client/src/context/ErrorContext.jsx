import {createContext, useContext, useState } from 'react';


const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);


export const ErrorProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState('')

    const value = {
        isOpen, setIsOpen,
        message, setMessage
    }

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
};