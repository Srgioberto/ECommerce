const dotenv = require('dotenv');
dotenv.config();
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

const port = process.env.PORT || 3000;

const initializeServer = () => {
  return app.listen(port, () => {
    console.log('listening on port', port);
  });
};

module.exports = { app, initializeServer };
