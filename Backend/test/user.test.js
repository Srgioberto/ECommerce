const { app } = require('../server');
const { db } = require('../src/config'); // This imports the Sequelize instance
const request = require('supertest');
const { User } = require('../src/config');

describe('Sequelize Test Setup', () => {
  const email = 'test@test.com';
  const password = '12345678';
  beforeAll(async () => {
    await db.sequelize.sync({ force: true }); // Recreate tables for the test environment
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close connection after all tests
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  test('can connect to the database', async () => {
    expect(db.sequelize).toBeDefined();
    expect(await db.sequelize.authenticate()).toBeUndefined(); // Authenticate returns void on success
  });

  test('should return 200', async () => {
    await request(app).get('/health').expect(200);
  });

  test('should return 404 because route does not exists', async () => {
    await request(app).get('/api/auth/register').expect(404);
  });
  test('should not create a user if the inputs are invalid', async () => {
    await request(app).post('/api/auth/register').send({}).expect(500);
  });
  test('should create a user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'testingName',
        lastName: 'testingLastName',
        phone: '123123',
        email,
        password,
      })
      .expect(201);
    const user = await User.findOne({ email });
    expect(email).toBe(user.email);
  });

  test('should return a cookie related to the user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'testingName',
        lastName: 'testingLastName',
        phone: '123123',
        email,
        password,
      })
      .expect(201);

    const cookies = response.headers['set-cookie'];
    expect(cookies.length).toBe(1);
  });

  test('should return a hash the password of the user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'testingName',
        lastName: 'testingLastName',
        phone: '123123',
        email,
        password,
      })
      .expect(201);

    const user = await User.findOne({ email });
    expect(password).not.toBe(user.password);
  });

  test('should throw an error if user is already register', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'testingName',
        lastName: 'testingLastName',
        phone: '123123',
        email,
        password,
      })
      .expect(201);
    await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'testingName',
        lastName: 'testingLastName',
        phone: '123123',
        email,
        password,
      })
      .expect(500);
  });
});
