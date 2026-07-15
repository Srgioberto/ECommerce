const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');
const cookieSession = require('cookie-session');

const { apiRouter } = require('./src/routes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3001', // Allow only this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(bodyParse.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test',
  })
);

// Define the /health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', apiRouter);

// Catches errors thrown by middleware (e.g. multer rejecting an oversized or
// non-image upload) so the client gets a JSON error instead of an opaque
// HTML 500 page that axios can't parse.
app.use((err, req, res, next) => {
  if (!err) return next();
  console.error(err);
  res.status(400).json({ error: err.message || 'Request failed' });
});

const port = process.env.PORT || 3000;

const initializeServer = () => {
  return app.listen(port, () => {
    console.log('listening on port', port);
  });
};

module.exports = { app, initializeServer };
