const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dev: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: 'mysql',
    pool: {
      max: 5, // Maximum number of connections
      min: 0, // Minimum number of connections
      acquire: 30000, // Max time (ms) that pool will try to get connection before throwing error
      idle: 10000, // Max time (ms) that a connection can be idle before being released
    },
  },
  test: {
    dialect: 'sqlite', // Use SQLite for testing
    storage: ':memory:', // SQLite in-memory for fast tests
    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // Disable logging in test mode to avoid clutter
  },
};
