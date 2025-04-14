const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Your verification token (32-80 characters, alphanumeric, underscore, or hyphen)
const verificationToken = 'a94cbd68e463cb9780e2008b1f61986110a5fd0ff8b99c9cba15f1f802ad65f9';

// Your endpoint URL (will be provided by Render)
const endpointUrl = 'https://ebaycardfetch.onrender.com/ebay-notifications'; // Update after deployment

// Handle eBay verification challenge (GET request)
app.get('/ebay-notifications', (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (!challengeCode) {
    return res.status(400).json({ error: 'Missing challenge_code' });
  }

  // Compute the challenge response
  const toHash = challengeCode + verificationToken + endpointUrl;
  const hash = crypto.createHash('sha256').update(toHash).digest('hex');
  const response = { challengeResponse: hash };

  res.status(200).json(response);
});

// Handle eBay notifications (POST request)
app.post('/ebay-notifications', (req, res) => {
  console.log('Received eBay notification:', req.body);
  // Process the notification if needed (e.g., log to a database)
  res.status(200).send('Notification received');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});