import axiosInstance, { apis } from "../Helper/axiosInstance";

export const fetchRecipes = async () => {
  try {
    const response = await axiosInstance.get(apis.RECIPES);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const addRecipe = async (newRecipe) => {
  try {
    const response = await axiosInstance.post(apis.RECIPES, newRecipe);
    return response.data;
  } catch (error) {
    console.error("Error adding new recipe:", error);
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await axiosInstance.delete(`${apis.RECIPES}/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete recipe:", error);
    throw error; 
  }
};
