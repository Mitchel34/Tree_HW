//Simple server example

const express = require('express');
const app = express();    

// Load the tree data from JSON file
const data = require('./tree.json');

// Serve static files from the 'public' directory
app.use(express.static('public')); 

// API endpoint to get the keys (button IDs)
app.get('/api/keys', (req, res) => {
  res.json(Object.keys(data));
});

// API endpoint to get data for a specific tree by key
app.get('/api/tree/:key', (req, res) => {
  const key = req.params.key;
  
  if (data[key]) {
    res.json(data[key]);
  } else {
    res.status(404).json({ error: 'Tree data not found' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
