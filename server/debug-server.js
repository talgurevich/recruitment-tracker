const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Debug server is running' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Registration request received:', req.body);
  res.json({ message: 'Registration endpoint working' });
});

app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});