import "./Styles/App.css";
import Home from "./Home";
import ViewPost from "./Post/ViewPost";
import RecPost from "./Post/RecPost";
import AboutUs from "./About-Us/AboutUs";
import AboutTerrell from "./About-Us/Terrell";
import AboutAnshav from "./About-Us/Anshav";
import AboutNoah from "./About-Us/Noah";
import AboutKayla from "./About-Us/Kayla";
import AboutIssac from "./About-Us/Issac";
import AboutKarl from "./About-Us/Karl";
import Recipes from "./Recipes/Recipes";
import Signup from "./Signup/Signup";
import NavBar from "./Nav_Footer/NavBar";
import Footer from "./Nav_Footer/Footer";
import Search from "./Nav_Footer/Search";
import Login from "./Login/Login";
import Logout from "./Login/Logout";
import Profile from "./Profile/Profile";
import Bookmark from "./Profile/Bookmark";
import UpdateProfile from "./Profile/UpdateProfile";
import SubmittedRecipes from "./Recipes/SubmittedRecipes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeRecommender from "./RecipeRecommender/RecipeRecommender";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommendedrecipe" element={<RecPost />} />
        <Route path="/recipe/:recipeId" element={<ViewPost />} />
        <Route path="/bookmarks/:username" element={<Bookmark />} />
        <Route path="/addrecipe" element={<Recipes />} />
        <Route path="/submitted-recipes" element={<SubmittedRecipes />} />
        <Route path="/About-Us" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recommended" element={<RecipeRecommender />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/about-Terrell" element={<AboutTerrell />} />
        <Route path="/about-Anshav" element={<AboutAnshav />} />
        <Route path="/about-Noah" element={<AboutNoah />} />
        <Route path="/about-Kayla" element={<AboutKayla />} />
        <Route path="/about-Issac" element={<AboutIssac />} />
        <Route path="/about-Karl" element={<AboutKarl />} />
      </Routes>
      <Footer className="footer" />
    </div>
  );
}

export default App;
