const request = require('supertest');
const app = require('../app'); 
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const header = 'Bearer ' + process.env.API_KEY;

// Mock user data for testing
const mockUser = {
  username: 'testAccount',
  password: 'Test123@',
  
  altUsername:'testAccount999',
  altPassword:'wrongPass'
};

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.ATLAS_URI);
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Login Endpoint', () => {
 // Test case for successful login
  it('should login a user with correct credentials', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .set('Authorization', header)
      .send({
        username: mockUser.username,
        password: mockUser.password,
      })
      .expect(200);
    
    // Assertions
    expect(response.body.msg).toBe('You have logged in successfully');
    expect(response.body.userSession.username).toBe(mockUser.username);
  });

  // Test case for login with incorrect password
  it('should return error for login with incorrect password', async () => {
    await request(app)
      .post('/api/users/login')
      .set('Authorization', header)
      .send({
        username: mockUser.username,
        password: mockUser.altPassword,
      })
      .expect(400, { msg: 'Invalid credential' });
  });

  // Test case for login with non-existent username
  it('should return error for login with non-existent username', async () => {
    await request(app)
      .post('/api/users/login')
      .set('Authorization', header)
      .send({
        username: mockUser.altUsername,
        password: mockUser.altPassword,
      })
      .expect(400, { msg: 'User not found.' });
  });
});
