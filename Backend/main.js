const dotenv = require('dotenv');
dotenv.config();
const { initializeServer } = require('./server');
const { db } = require('./src/config');

function main() {
  // Initialize Sequelize and sync models with the database
  return db.sequelize
    .sync()
    .then(() => {
      console.log('Database synchronized.');
      return initializeServer();
    })
    .catch((err) => {
      console.log('Failed to sync database:', err);
    });
}

main();
