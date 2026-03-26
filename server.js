const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/encode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const encoded = Buffer.from(text, 'utf-8').toString('base64');
  res.json({ result: encoded });
});

app.post('/api/decode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const decoded = Buffer.from(text, 'base64').toString('utf-8');
    res.json({ result: decoded });
  } catch {
    res.status(400).json({ error: 'Invalid Base64 string' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
