import axiosInstance, {
  apis,
  spoonacularAxiosInstance,
} from "../Helper/axiosInstance";

const SPOON_QUERY = process.env.REACT_APP_SPOONACULAR_KEY;

export const retrieveRecomendations = async (searchTerm, preferences, allergies, skill) => {
  /*
    Get recipes from the Spoonacular API
  */
  let allRecipes = [];
  try {
    const responseFromSpoonacular = await spoonacularAxiosInstance.get(
      SPOON_QUERY + "&query=" + searchTerm + "&number=15"
    );
    allRecipes = responseFromSpoonacular.data.results;
    console.log("Got recipes successfully");
    //return allRecipes;
  } catch (error) {
    console.error("Failed to get recipes from Spoonacular:", error);
    return [];
  }
  /*
    Get recommendations from the backend API using recipes
  */
  const recipeTitles = allRecipes.map(recipe => recipe.title);
  try {
    const responseFromAPI = await axiosInstance.post(
      `${apis.USERS}/recommendations`,
      { recipes: recipeTitles,
        preferences: preferences,
        allergies: allergies,
        skill: skill
       }
    );
    console.log("Got reccommendations successfully");
    /*
      Filter the recipes based on the recommendations
    */
    const recommendedRecipeTitles = responseFromAPI.data.response;
    const recommendedRecipes = allRecipes.filter(recipe => recommendedRecipeTitles.includes(recipe.title));
    return recommendedRecipes;
  } catch (error) {
    console.error("Failed to get recommendations:", error);
  }
};

export const retrieveRecipe = async (recipeId) => {
  try {
    const other = process.env.REACT_APP_SPOON_RECIPE;
    const responseFromSpoonacular = await spoonacularAxiosInstance.get(
      `/${recipeId}/information` + other
    );
    console.log(responseFromSpoonacular.data);
    return responseFromSpoonacular.data;
  } catch (error) {
    console.error("Failed to get recipe details:", error);
    return null;
  }
}