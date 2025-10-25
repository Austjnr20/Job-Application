const express = require('express');
const path = require('path');
const cors = require('cors');
const { saveSubmission, getAllSubmissions } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static site
app.use(express.static(path.join(__dirname, '..')));

// POST /submit
app.post('/submit', (req, res) => {
  try {
    const body = req.body || {};
    const submission = {
      name: body.name || null,
      surname: body.surname || null,
      email: body.email || null,
      phone: body.phone || null,
      position: body.position || null,
      experience: body.experience ? Number(body.experience) : null,
      education: body.education || null,
      skills: body.skills || null,
      cover: body.cover || null,
      receivedAt: new Date().toISOString()
    };

    const id = saveSubmission(submission);

    // if browser form, redirect back
    const accept = req.get('Accept') || '';
    if (accept.includes('text/html')) return res.redirect('/');

    res.json({ success: true, id, submission });
  } catch (err) {
    console.error('submit error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /submissions
app.get('/submissions', (req, res) => {
  try {
    const rows = getAllSubmissions();
    res.json(rows);
  } catch (err) {
    console.error('get submissions error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
