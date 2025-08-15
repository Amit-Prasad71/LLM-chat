// Import express
const express = require('express');

// Create an express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Simple GET route
// app.get('/', (req, res) => {
// 	res.send('Hello World from Express.js!');
// });

// Define a port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
