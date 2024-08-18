const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const header = "Bearer " + process.env.API_KEY;

const Recipe = require('../models/recipeModel');

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
describe('Toggle Like Endpoint', () => {
  let recipeId;

  beforeAll(async () => {
    // Create a sample recipe for testing
    const recipe = await Recipe.create({
      recipeName: 'Test Recipe',
      description: 'Test recipe description',
      ingredients: ['Ingredient 1', 'Ingredient 2'],
      directions: ['Step 1', 'Step 2'],
      servings: 4,
      yieldIngredients: 'Yield ingredients',
      prepTime: '10 mins',
      cookTime: '20 mins',
      totalTime: '30 mins',
      notes: 'Test notes',
      createdBy: 'testuser', 
    });
    recipeId = recipe._id;
  });

  afterAll(async () => {
    await Recipe.findByIdAndDelete(recipeId);
  });

  it('should toggle like for a recipe', async () => {
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

    // Like the recipe
    const toggleLikeResponse = await request(app)
      .post(`/api/recipes/${recipeId}/like`)
      .send({ liked: true, username: mockUser.username })
      .set({
        "Authorization":header, 
        "Cookie": loginResponse.headers['set-cookie'],
      });

    expect(toggleLikeResponse.status).toBe(200);
    const likedRecipe = await Recipe.findById(recipeId);
    expect(likedRecipe.likes).toContain(mockUser.username);

    // Unlike the recipe
    const toggleUnlikeResponse = await request(app)
      .post(`/api/recipes/${recipeId}/like`)
      .send({ liked: false, username: 'testuser' })
      .set({
        "Cookie": loginResponse.headers['set-cookie'],
        "Authorization":header
      });

    expect(toggleUnlikeResponse.status).toBe(200);
    expect(toggleUnlikeResponse.body).toEqual({ message: 'Toggle successful' });

    // Check if the recipe no longer has the user's like
    const unlikedRecipe = await Recipe.findById(recipeId);
    expect(unlikedRecipe.likes).not.toContain('testuser');
  });

  it('should return 404 if recipe is not found', async () => {
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

    // Attempt to toggle like on a non-existent recipe
    const invalidRecipeId = new mongoose.Types.ObjectId();
    const toggleLikeResponse = await request(app)
      .post(`/api/recipes/${invalidRecipeId}/like`)
      .send({ liked: true, username: 'testuser' })
      .set({
        "Cookie": loginResponse.headers['set-cookie'],
        "Authorization":header
      });

    expect(toggleLikeResponse.status).toBe(404);
    expect(toggleLikeResponse.body).toEqual({ error: 'Recipe not found' });
  });
});
