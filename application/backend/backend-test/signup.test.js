const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const header = "Bearer " + process.env.API_KEY;

// Mock user data for testing
const mockUser = {
  name: "Back End Test Account",
  username: "backendTestAccount",
  password: "Test123@",
  email: "backendtestaccount@gmail.com",
  age: "1",
};

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(process.env.ATLAS_URI);
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Signup Endpoint', () => {
    let userId;
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', header)
        .send(mockUser)
        .expect(200);
  
      // Check if the response contains the created user
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(mockUser.name);
      expect(response.body.user.age).toBe(mockUser.age);
      expect(response.body.user.username).toBe(mockUser.username);
      expect(response.body.user.email).toBe(mockUser.email);
  
      // Save the user ID for later use
      userId = response.body.user;
    });
  });
