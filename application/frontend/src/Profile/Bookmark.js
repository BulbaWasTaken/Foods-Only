
import React, { useEffect, useState } from "react";
import axios, { apis } from "../Helper/axiosInstance";
import { fetchRecipes } from "../Recipes/recipeService";
import { useParams, Link } from "react-router-dom";
import "../Styles/Bookmark.css";
const header = 'Bearer ' + process.env.REACT_APP_API_KEY;

function Bookmark() {
    const [recipes, setRecipes] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { username } = useParams();

    useEffect(() => {
        const fetchBookmarks = async () => {
            console.log("Fetching bookmarks for username:", username);
            try {
                const profileResponse = await axios.get(`${apis.PROFILES}/${username}`, {
                    headers: { 'Authorization': header }
                });

                if (profileResponse.data && profileResponse.data.profile && profileResponse.data.profile.bookmarks) {
                    console.log("Bookmarks fetched:", profileResponse.data.profile.bookmarks);
                    fetchRecipesForBookmarks(profileResponse.data.profile.bookmarks);
                } else {
                    console.error("Profile data is incomplete or bookmarks are missing.");
                    setError("Failed to retrieve valid bookmark data.");
                }
            } catch (err) {
                console.error("Failed to fetch bookmarks:", err);
                setError("Failed to fetch bookmarks due to an error.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [username]);

    const fetchRecipesForBookmarks = async (bookmarkIds) => {
        console.log("Starting to fetch recipes for bookmark IDs:", bookmarkIds);

        const recipePromises = bookmarkIds.map(id =>
            axios.get(`${apis.RECIPES}/${id}`)
                .then(response => {
                    console.log(`Fetched recipe for ID ${id}:`, response.data);
                    return response;
                })
                .catch(err => {
                    console.error('Error fetching recipe:', id, err);
                    return null;
                })
        );

        Promise.all(recipePromises)
            .then(recipeResponses => {
                console.log("All recipe responses received:", recipeResponses);
                const fetchedRecipes = recipeResponses.map(response => response ? response.data : null);
                console.log("Processed recipes data (nulls are failures):", fetchedRecipes);
                setRecipes(fetchedRecipes.filter(Boolean)); // Filter out any nulls due to failed requests
            })
            .catch(error => {
                console.error("Failed to fetch recipes for bookmarks:", error);
                setError("Failed to load some recipes.");
            });
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const { recipeId } = useParams;

    return (
        <div>
            <h1>{username}'s Bookmarked Recipes</h1>
            <div className="recipe-cards">
                {recipes.map((recipe, index) => {
                    console.log(`Rendering recipe #${index}:`, recipe.recipe._id);
                    return (
                        <div className="recipe-card--1">
                            <Link to={`/recipe/${recipe.recipe._id}`} key={index} style={{ textDecoration: 'none' }}>
                                <h2>{recipe.recipe.recipeName}</h2>
                                <p>{recipe.recipe.description}</p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}

export default Bookmark;


