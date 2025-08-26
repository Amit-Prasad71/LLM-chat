import { createContext, useContext, useState } from 'react';

const ModelContext = createContext();

export const useModelContext = () => useContext(ModelContext);

export const ModelProvider = ({ children }) => {
    const [model, setModel] = useState('');
    const [key, setKey] = useState('');

    const value = {
        model,
        setModel,
        key,
        setKey,
    };

    return (
        <ModelContext.Provider value={value}>
            {children}
        </ModelContext.Provider>
    );
};