const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Vercel serverless functions run per-request. Writing to the project filesystem is not persistent, but
// /tmp is writable for the lifetime of the function instance (still ephemeral). For production, use a
// database (Vercel KV, Supabase, Fauna, etc.).

const TEMP_FILE = path.join('/tmp', 'submissions.json');

function readTmp() {
  try {
    const raw = fs.readFileSync(TEMP_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeTmp(data) {
  try {
    fs.writeFileSync(TEMP_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('writeTmp error', err);
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Vercel's Node runtime does not automatically parse urlencoded bodies for raw functions.
  // We will accept application/json and application/x-www-form-urlencoded.
  let body = {};
  const contentType = (req.headers['content-type'] || '').split(';')[0];

  if (contentType === 'application/json') {
    body = req.body || {};
  } else if (contentType === 'application/x-www-form-urlencoded') {
    // req.body may be empty; fall back to reading raw body if available
    if (req.body && Object.keys(req.body).length) {
      body = req.body;
    } else {
      // attempt to read raw body (Vercel may provide it on req)
      let raw = '';
      try {
        raw = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => (data += chunk));
          req.on('end', () => resolve(data));
          req.on('error', reject);
        });
      } catch (err) {
        raw = '';
      }
      body = querystring.parse(raw);
    }
  } else {
    // Try to use req.body anyway
    body = req.body || {};
  }

  const submission = Object.assign({}, body, { receivedAt: new Date().toISOString() });

  const submissions = readTmp();
  submissions.push(submission);

  const ok = writeTmp(submissions);
  if (!ok) {
    return res.status(500).json({ success: false, error: 'Failed to save submission' });
  }

  // For a browser form post, redirect back to the homepage (so existing form behavior still works)
  const accept = req.headers['accept'] || '';
  if (accept.includes('text/html')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  res.json({ success: true, submission });
};
