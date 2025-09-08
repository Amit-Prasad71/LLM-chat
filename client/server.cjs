const express = require('express');
const path = require('path');

// Get command-line arguments, skipping the first two (executable path)
const args = process.argv.slice(2);

// Set a default port
let port = 3000;

const portArg = parseInt(args[0], 10);
if (!isNaN(portArg) && portArg > 0) {
  port = portArg; 
}


const app = express();


app.use(express.static(path.join(__dirname, 'dist')));

// For any other request that doesn't match a static file,
// send the index.html file. This is the catch-all for SPA routing.
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running! Open http://localhost:${port} in your browser.`);
});