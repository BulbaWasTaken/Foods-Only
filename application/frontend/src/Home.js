import "./Styles/Home.css";
import { useEffect, useState } from "react";
import { fetchRecipes } from "./Recipes/recipeService";
import { Link } from "react-router-dom";

const Home = () => {
  const [trendingRecipes, setTrendingRecipes] = useState(
    [],
  ); /* State for storing trending recipes */

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const recipes = await fetchRecipes();
        const filteredRecipes = recipes.recipes.filter(
          (recipe) => recipe.recipeName,
        ); /* Filtering recipes that have a name */
        const lastFifteenRecipes =
          filteredRecipes.slice(-15); /* Getting the last fifteen recipes */

        //   console.log("Checking for images in the last fifteen recipes:");
        // lastFifteenRecipes.forEach(recipe => {
        //   console.log(`${recipe.recipeName} image:`, recipe.image);
        // });

        if (lastFifteenRecipes.length > 0) {
          setTrendingRecipes(
            lastFifteenRecipes,
          ); /* Updating state if recipes are found */
        } else {
          console.error("No trending recipes found.");
        }
      } catch (error) {
        console.error("Error fetching trending recipes:", error);
      }
    };

    fetchTrendingRecipes();
  }, []);

  /* Array of images to display in the carousel */
  const items = [
    {
      image:
        "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/02/Creamy-Cajun-Chicken-6.jpg",
      name: "Image 1",
    },
    {
      image:
        "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/05/Potato-Salad-7.jpg",
      name: "Image 2",
    },
    {
      image:
        "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/01/Garlic-Roasted-Potatoes-6-1.jpg",
      name: "Image 3",
    },
  ];

  /* Carousel component for displaying images 
     and paragraph displaying the trending recipe 
     name
  */

  return (
    <div className="home">
      <div className="recipes">
        <div className="grid-container">
          {trendingRecipes.slice(0, 9).map((recipe, i) => ( 
            <div key={i} className="grid-item">
              <img
                src={recipe.image} 
                alt={recipe.recipeName} 
                className="grid-image"
              />
            </div>
          ))}
        </div>
      </div>
      <aside className="sidebar">
        <h2>Trending recipes this week</h2>
        <div className="recipe-list">
          {trendingRecipes.map((recipe, index) => (
            <div className="recipe-card" key={index}>
              <Link style={{ textDecoration: "none" }} to={`/recipe/${recipe._id}`}>
                <p >{recipe.recipeName}</p>
              </Link>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Home;
