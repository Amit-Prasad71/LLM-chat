import {createContext, useContext, useState } from 'react';


const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);


export const ErrorProvider = ({ children }) => {
    const [showError, setShowError] = useState(false);
    const [errMessage, setErrMessage] = useState('')

    const value = {
        showError, setShowError,
        errMessage, setErrMessage
    }

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
};