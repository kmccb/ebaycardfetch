const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const verificationToken = 'a94cbd68e463cb9780e2008b1f61986110a5fd0ff8b99c9cba15f1f802ad65f9';
const endpointUrl = 'https://ebaycardfetch.onrender.com/ebay-notifications';

app.get('/ebay-notifications', (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (!challengeCode) {
    return res.status(400).json({ error: 'Missing challenge_code' });
  }

  const toHash = challengeCode + verificationToken + endpointUrl;
  const hash = crypto.createHash('sha256').update(toHash).digest('hex');
  const response = { challengeResponse: hash };

  res.status(200).json(response);
});

app.post('/ebay-notifications', (req, res) => {
  console.log('Received eBay notification:', req.body);
  res.status(200).send('Notification received');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});