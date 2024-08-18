import axios, { apis } from "../Helper/axiosInstance";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "../Helper/auth";
import { fetchRecipes } from "../Recipes/recipeService";
import axiosInstance from "../Helper/axiosInstance";
import "../Styles/UserProfile.css";
import { all } from "axios";

/*
  User profile component that displays user information:
  username, cooking experience, profile picture, posts, 
  and bio.
*/
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const { username } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const auth = await isAuthenticated();
      const response = await axios.get(apis.PROFILES + `/${username}`);
      /*
        Fetch session info to get the logged-in user's username
      */
      if (auth) {
        const sessionInfo = await axios.get(apis.USERS + "/session");
        setLoggedInUsername(sessionInfo.data.username);
      }
      if (response.status === 200) {
        setProfile(response.data.profile);
      } else {
        console.error("Failed to fetch profile:", response.data.error);
      }
      
      //Fetch posts created by the user
      const allRecipes = await fetchRecipes();
      if (allRecipes.recipes && allRecipes.recipes.length > 0) {
        const userPosts = allRecipes.recipes.filter((recipe) => recipe.createdBy === username);
        setPosts(userPosts);
      } else {
        console.error("Failed to fetch user posts:", allRecipes.data.error);
      }
    };
    /*
      Fetch the logged-in user's profile when the component mounts
    */
    fetchProfile();
  }, [username, navigate]);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await axiosInstance.delete(`${apis.RECIPES}/${recipeId}`);
      console.log("Recipes fetched: ", response);
      if (response.status === 200) {
        console.log('Recipe deleted successfully');
        setPosts(posts => posts.filter(post => post._id !== recipeId));
      } else {
        throw new Error('Failed to delete the recipe');
      }
    } catch (error) {
      console.error('Error deleting the recipe:', error);
    }
  };

  const handleEditProfileClick = () => {
    navigate("/updateProfile");
    window.location.reload();
  };

  return (
    <div className="user-profile-container">
      <div className="profile-details">
        {profile && (
          <>
            <div className="profile-image-container">
              <div className="profile-image">
                {profile.profileImage && (
                  <img src={profile.profileImage} alt={profile.username} />
                )}
              </div>
              {loggedInUsername === profile.username && (
                <button onClick={handleEditProfileClick} className="edit-profile-link">
                  Edit Profile
                </button>
              )}
            </div>
            <div className="profile-info">
              <h2 className="username">@{profile.username}</h2>
              <span className="cooking-experience">Cooking Experience: {profile.cookingExperience}</span>
              <div className="bio-container">
                <h3 className="bio-header">Bio</h3>
                <p className="bio">{profile.bio ? profile.bio : "No bio available"}</p>
              </div>
              <div className="food-preferences-container">
                <h3 className="food-preferences-header">Food Preferences</h3>
                <p className="food-preferences">{profile.foodPreference || "No food preferences specified"}</p>
              </div>
              <div className="allergies-container">
                <h3 className="allergies-header">Allergies</h3>
                <p className="allergies">{profile.allergies || "No allergies specified"}</p>
              </div>
              <div className="profile-buttons">
                <Link to={`/bookmarks/${username}`}>
                  <button className="profile-button">Bookmarks</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="posts-container">
        {posts.length > 0 && posts.map((post, index) => (
          <div key={index} className="user-posts">
            <Link to={`/recipe/${post._id}`}>
              <img className="post-image" src={post.image} alt={post.recipeName} />
            </Link>
            <div className="post-meta">
              <p className="post-title">{post.recipeName}</p>
              {loggedInUsername === profile.username && (
                <button
                className="delete-post-button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete this recipe?`)) {
                    handleDeleteRecipe(post._id);
                  }
                }}
              >
                Delete Post
              </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
