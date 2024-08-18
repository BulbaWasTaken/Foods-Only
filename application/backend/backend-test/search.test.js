const request = require('supertest');
const app = require('../app'); 
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const header = 'Bearer ' + process.env.API_KEY;

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.ATLAS_URI);
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Search Endpoint', () => {
    it('should search for recipes based on the provided term', async () => {
      const searchTerm = 'Test';
      const response = await request(app)
        .get(`/api/recipes/search/${searchTerm}`)
        .set('Authorization', header)
        .expect(200);
  
      // Asserting the response body structure
      expect(response.body).toHaveProperty('recipes');
      expect(Array.isArray(response.body.recipes)).toBe(true);
  
      // Asserting that the array length is more than 0
      expect(response.body.recipes.length).toBeGreaterThan(0);
    });
    it('should return an empty array when recipe does not exist', async () => {
        const searchTerm = 'afsdagaa31231';
        const response = await request(app)
          .get(`/api/recipes/search/${searchTerm}`)
          .set('Authorization', header)
          .expect(200);
    
        // Asserting the response body structure
        expect(response.body).toHaveProperty('recipes');
        expect(Array.isArray(response.body.recipes)).toBe(true);
    
        // Asserting that the array length is more than 0
        expect(response.body.recipes).toHaveLength(0);
      });

      it('should search for profiles based on the provided username', async () => {
        const searchTerm = 'bulba';
        const response = await request(app)
          .get(`/api/profiles/search/${searchTerm}`)
          .set('Authorization', header)
          .expect(200);
    
        // Asserting the response body structure
        expect(response.body).toHaveProperty('profiles');
        expect(Array.isArray(response.body.profiles)).toBe(true);
    
        // Asserting that the array length is more than 0
        expect(response.body.profiles.length).toBeGreaterThan(0);
      });
  });
