import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ViewPost from "../src/Post/ViewPost";
import { fetchRecipes } from "../src/Recipes/recipeService";
import { useParams } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

// Mock necessary modules
jest.mock("../src/Recipes/recipeService");
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

describe("ViewPost Component", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ recipeId: "1" });
    fetchRecipes.mockResolvedValue({
      recipes: [
        {
          _id: "1",
          recipeName: "Chocolate Cake",
          description: "Delicious dark chocolate cake.",
          ingredients: ["2 cups flour", "1 cup sugar", "100g dark chocolate"],
          directions: ["Mix ingredients", "Bake for 45 minutes at 180°C"],
          notes: "Use high-quality chocolate for better results.",
          servings: 4,
          prepTime: 20,
          cookTime: 45,
          totalTime: 65,
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays recipe details correctly when data is fetched", async () => {
    useParams.mockReturnValue({ recipeId: "1" });
    fetchRecipes.mockResolvedValue({
      recipes: [
        {
          _id: "1",
          recipeName: "Chocolate Cake",
          description: "Delicious dark chocolate cake.",
          ingredients: ["2 cups flour", "1 cup sugar", "100g dark chocolate"],
          directions: ["Mix ingredients", "Bake for 45 minutes at 180°C"],
          notes: "Use high-quality chocolate for better results.",
          servings: 4,
          prepTime: 20,
          cookTime: 45,
          totalTime: 65,
        },
      ],
    });
    
    render(<ViewPost />);

  
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.getByText("Delicious dark chocolate cake.")).toBeInTheDocument();
      expect(screen.getByText("2 cups flour")).toBeInTheDocument();
      expect(screen.getByText("Mix ingredients")).toBeInTheDocument();
      expect(screen.getByText("Bake for 45 minutes at 180°C")).toBeInTheDocument();
      expect(screen.getByText("Use high-quality chocolate for better results.")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("20 minutes")).toBeInTheDocument();
      expect(screen.getByText("45 minutes")).toBeInTheDocument();
      expect(screen.getByText("65 minutes")).toBeInTheDocument();
    
  });

  it("displays an error message if the recipe data fails to load", async () => {
    fetchRecipes.mockRejectedValue(new Error("Failed to fetch recipe details"));
    render(<ViewPost />);

    await waitFor(() => {
      expect(screen.getByText("Could not fetch recipe details. Please try again later.")).toBeInTheDocument();
    });
  });
});
