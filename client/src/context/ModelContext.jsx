import { createContext, useContext, useState } from 'react';

const ModelContext = createContext();

export const useModelContext = () => useContext(ModelContext);

export const ModelProvider = ({ children }) => {
    const [model, setModel] = useState('');
    const [key, setKey] = useState('');
    const [ollamaModel, setOllamaModel] = useState('')
    const [ollamaLocalPort, setOllamaLocalPort] = useState(11434)
    const [temp, setTemp] = useState(0.7);
    const [topP, setTopP] = useState(1);
    const [topK, setTopK] = useState(50);
    const [preamble, setPreamble] = useState('')

    const value = {
        model, setModel,
        key, setKey,
        ollamaModel, setOllamaModel,
        temp, setTemp,
        topP, setTopP,
        topK, setTopK,
        ollamaLocalPort, setOllamaLocalPort,
        preamble, setPreamble
    };

    return (
        <ModelContext.Provider value={value}>
            {children}
        </ModelContext.Provider>
    );
};