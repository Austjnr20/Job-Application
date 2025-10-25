const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'submissions.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (index.html, styles.css, etc.)
app.use(express.static(path.join(__dirname)));

// Helper to read submissions file (returns array)
function readSubmissions() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

// POST /submit - accept form submissions (form-urlencoded or JSON)
app.post('/submit', (req, res) => {
  const submission = Object.assign({}, req.body, { receivedAt: new Date().toISOString() });
  const submissions = readSubmissions();
  submissions.push(submission);
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf8');
    // If request came from a browser form, redirect to a thank-you page or back to root
    if (req.get('Accept') && req.get('Accept').includes('text/html')) {
      return res.redirect('/');
    }
    return res.json({ success: true, submission });
  } catch (err) {
    console.error('Failed to save submission', err);
    return res.status(500).json({ success: false, error: 'Failed to save submission' });
  }
});

// GET /submissions - returns all saved submissions (JSON)
app.get('/submissions', (req, res) => {
  const submissions = readSubmissions();
  res.json(submissions);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
