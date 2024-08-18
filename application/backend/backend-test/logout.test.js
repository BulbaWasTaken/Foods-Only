const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const header = "Bearer " + process.env.API_KEY;

// Mock user data for testing
const mockUser = {
  username: 'testAccount',
  password: 'Test123@',
  
  altUsername:'testAccount999',
  altPassword:'wrongPass'
};
/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(process.env.ATLAS_URI);
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.disconnect();
});
describe('Logout Endpoint', () => {
    it('should clear the session and return 200 status', async () => {
      const loginResponse = await request(app)
      .post('/api/users/login')
      .set('Authorization', header)
      .send({
        username: mockUser.username,
        password: mockUser.password,
      })
      .expect(200);
    
    // Assertions
    expect(loginResponse.body.msg).toBe('You have logged in successfully');
    expect(loginResponse.body.userSession.username).toBe(mockUser.username);
  
      // Logout
      const logoutResponse = await request(app)
        .delete('/api/users/logout')
        .set({
          "Cookie": loginResponse.headers['set-cookie'],
          "Authorization":header,
        });
  
      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.text).toBe('Logout Success');
  
      // Verify session is cleared
      const sessionInfoResponse = await request(app)
        .get('/api/users/session')
        .set('Authorization', header);;
  
      expect(sessionInfoResponse.status).toBe(401);
      expect(sessionInfoResponse.body).toBe('unauthorize');
    });
  
    it('should return 401 status if user is not logged in', async () => {
      // Attempt to logout without logging in first
      const logoutResponse = await request(app)
        .get('/api/users/session')
        .set('Authorization', header);
  
      expect(logoutResponse.status).toBe(401);
      expect(logoutResponse.body).toBe('unauthorize');
    });
  });

