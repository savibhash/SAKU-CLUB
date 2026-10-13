const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'saku_club_classified_secret_key_2026';
const FOUNDER_CLEARANCE_KEY = 'SAKU-SUPREME-2026'; // Only you know this key!

const DATA_FILE = path.join(__dirname, 'members.json');
const SANCTUM_FILE = path.join(__dirname, 'sanctum_feed.json');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets (images, css, html) from this folder
app.use(express.static(__dirname));

// Serve index.html on root access
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Database Helpers
function getMembers() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = [{
      username: '001 THE SUPREME',
      role: 'Founder',
      passwordHash: bcrypt.hashSync('founder2026', 10),
      joinedAt: new Date().toISOString()
    }];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(fileData || '[]');
}

function saveMembers(members) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2));
}

function getSanctumFeed() {
  if (!fs.existsSync(SANCTUM_FILE)) {
    const initialFeed = [
      {
        sender: '001 THE SUPREME',
        role: 'Founder',
        content: 'System initialized. Welcome to the classified network.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    fs.writeFileSync(SANCTUM_FILE, JSON.stringify(initialFeed, null, 2));
    return initialFeed;
  }
  const fileData = fs.readFileSync(SANCTUM_FILE, 'utf-8');
  return JSON.parse(fileData || '[]');
}

function saveSanctumFeed(feed) {
  fs.writeFileSync(SANCTUM_FILE, JSON.stringify(feed, null, 2));
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// 1. PUBLIC ROUTE: Chamber Member List
app.get('/api/members', (req, res) => {
  const members = getMembers();
  const safeList = members.map(({ username, role, joinedAt }) => ({ username, role, joinedAt }));
  res.json(safeList);
});

// 2. PROTECTED REGISTRATION ROUTE (Requires Founder Clearance)
app.post('/api/register', async (req, res) => {
  const { username, password, clearanceKey, role } = req.body;

  if (!username || !password || !clearanceKey) {
    return res.status(400).json({ error: 'Alias, Secret Key, and Founder Clearance Key are required.' });
  }

  if (clearanceKey !== FOUNDER_CLEARANCE_KEY) {
    return res.status(403).json({ error: 'Access Denied: Invalid Founder Clearance Key. Membership is strictly invite-only.' });
  }

  const members = getMembers();
  const exists = members.some(m => m.username.toLowerCase() === username.toLowerCase().trim());

  if (exists) {
    return res.status(400).json({ error: 'This Alias is already claimed.' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newMember = {
    username: username.trim(),
    role: role && role.trim() !== '' ? role.trim() : 'Initiate',
    passwordHash,
    joinedAt: new Date().toLocaleDateString()
  };

  members.push(newMember);
  saveMembers(members);

  const token = jwt.sign({ username: newMember.username, role: newMember.role }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: `Identity authorized and forged: ${newMember.username} [${newMember.role}]`,
    token,
    user: { username: newMember.username, role: newMember.role }
  });
});

// 3. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Alias and Secret Key are required.' });
  }

  const members = getMembers();
  const member = members.find(m => m.username.toLowerCase() === username.toLowerCase().trim());

  if (!member) {
    return res.status(401).json({ error: 'Identity not recognized in the Order.' });
  }

  const isMatch = await bcrypt.compare(password, member.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid Secret Key.' });
  }

  const token = jwt.sign({ username: member.username, role: member.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: `Access granted. Welcome back, ${member.username}.`,
    token,
    user: { username: member.username, role: member.role }
  });
});

// 4. INNER SANCTUM FEED ROUTES
app.get('/api/sanctum/feed', authenticateToken, (req, res) => {
  const feed = getSanctumFeed();
  res.json(feed);
});

app.post('/api/sanctum/feed', authenticateToken, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Transmission content cannot be empty.' });
  }

  const feed = getSanctumFeed();
  const newTransmission = {
    sender: req.user.username,
    role: req.user.role,
    content: content.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  feed.push(newTransmission);
  saveSanctumFeed(feed);

  res.status(201).json(newTransmission);
});

app.listen(PORT, () => {
  console.log(`[SAKU CLUB ENGINE] Online at http://localhost:${PORT}`);
});