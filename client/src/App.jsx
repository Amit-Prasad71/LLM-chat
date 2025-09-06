import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatApp from './components/ChatApp.jsx';
import { ModelProvider } from "./context/ModelContext.jsx";
import { ErrorProvider } from "./context/ErrorContext.jsx";


function App() {
    return (
        <ErrorProvider>
            <ModelProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<ChatApp />} />
                        <Route path="/c" element={<Navigate to="/" replace />} />
                        <Route path="/c/" element={<Navigate to="/" replace />} />
                        <Route path="/c/:chatId?" element={<ChatApp />} />
                    </Routes>
                </Router>
            </ModelProvider>
        </ErrorProvider>
    );
}

export default App;