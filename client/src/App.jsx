import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatApp from './components/ChatApp.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ChatApp />} />
                <Route path="/c" element={<Navigate to="/" replace />} />
                <Route path="/c/" element={<Navigate to="/" replace />} />
                <Route path="/c/:chatId?" element={<ChatApp />} />
            </Routes>
        </Router>

    );
}

export default App;