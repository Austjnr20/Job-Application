const fs = require('fs');
const path = require('path');

const TEMP_FILE = path.join('/tmp', 'submissions.json');

function readTmp() {
  try {
    const raw = fs.readFileSync(TEMP_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const submissions = readTmp();
  res.json(submissions);
};
