import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../src/Home';
import { fetchTrendingRecipes } from '../src/Recipes/recipeService';

// Mocking fetchTrendingRecipes 
jest.mock('../src/Recipes/recipeService', () => ({
    fetchTrendingRecipes: jest.fn(),
}));

describe('Home Component - Trending Recipes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('displays trending recipes based on search frequency', async () => {
        fetchTrendingRecipes.mockResolvedValue([
            { _id: '1', recipeName: 'Spaghetti Carbonara', description: 'Classic Italian pasta.', searchFrequency: 150 },
            { _id: '2', recipeName: 'Chicken Tikka Masala', description: 'Popular Indian curry.', searchFrequency: 125 }
        ]);

        render(<Home />);
        await waitFor(() => expect(fetchTrendingRecipes).toHaveBeenCalled());

        expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
        expect(await screen.findByText('Chicken Tikka Masala')).toBeInTheDocument();
    });

    it('displays a message when there are no trending recipes available', async () => {
        fetchTrendingRecipes.mockResolvedValue([]);

        render(<Home />);
        await waitFor(() => expect(fetchTrendingRecipes).toHaveBeenCalled());

        expect(await screen.findByText('No trending recipes available.')).toBeInTheDocument();
    });

    it('displays an error message if the trending recipes cannot be fetched', async () => {
        fetchTrendingRecipes.mockRejectedValue(new Error("Failed to fetch trending recipes"));

        render(<Home />);
        await waitFor(() => expect(fetchTrendingRecipes).toHaveBeenCalled());

        expect(await screen.findByText('Error loading trending recipes. Please try again later.')).toBeInTheDocument();
    });
});
