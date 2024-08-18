import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ViewPost from '../src/Post/ViewPost';
import { BrowserRouter } from 'react-router-dom';
import { fetchRecipes } from '../src/Recipes/recipeService';
import '@testing-library/jest-dom/extend-expect';

// Mocking necessary parts
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    recipeId: '1'
  })
}));

jest.mock('../src/Recipes/recipeService', () => ({
  fetchRecipes: jest.fn()
}));

const mockRecipe = {
  _id: '1',
  recipeName: 'Sample Recipe',
  description: 'A sample recipe description',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  directions: ['Step 1', 'Step 2'],
  likes: [],
  bookmarked: false
};

describe('Bookmark functionality in ViewPost component', () => {
  beforeEach(() => {
    fetchRecipes.mockResolvedValue({ recipes: [mockRecipe] });
  });

  it('toggles bookmark icon when clicked', async () => {
    render(
      <BrowserRouter>
        <ViewPost />
      </BrowserRouter>
    );

    // Ensure component has loaded data
    expect(await screen.findByText('Sample Recipe')).toBeInTheDocument();

    // Get the bookmark icon and simulate a click
    const bookmarkIcon = screen.getByRole('img', { name: /bookmark/i });
    expect(bookmarkIcon).toHaveClass('fa-bookmark'); // Initial state checks if it is not bookmarked
    fireEvent.click(bookmarkIcon);
    expect(bookmarkIcon).toHaveClass('bookmarked'); // Check if the class changes to "bookmarked"

    // Click again to unbookmark
    fireEvent.click(bookmarkIcon);
    expect(bookmarkIcon).not.toHaveClass('bookmarked'); // Should toggle back to not bookmarked
  });
});
