import axios, { apis } from "../Helper/axiosInstance";
import React, { useEffect, useState } from "react";
import { editProfile } from "./profileService";
import { useNavigate } from "react-router-dom";
import "../Styles/UpdateProfile.css";

const CLOUDINARY_NAME = process.env.REACT_APP_CLOUDINARY_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

//foodsOnly
const UpdateProfile = () => {
  // eslint-disable-next-line
  const [username, setUsername] = useState("");
  // eslint-disable-next-line
  const [bio, setBio] = useState("");
  const [allergies, setAllergies] = useState("");
  const [cookingExperience, setCookingExperience] = useState("");
  const [foodPreference, setFoodPreference] = useState("");
  const [image, setImage] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [publicId, setPublicId] = useState("");
  const navigate = useNavigate();

  const imageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_NAME);
    return fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      {
        method: "post",
        body: data,
      },
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteImage = async (e) => {
    if (profileImg) {
      try {
        const response = await axios.delete(apis.IMAGES + "/deleteImage", {
          data: { profileImg, publicId },
        });
        return response.data;
      } catch (error) {
        alert("Error adding new user:" + error);
        console.error("Error logging in:", error);
      }
    } else {
      console.warn("No image to delete");
    }
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!(profileImg === "https://res.cloudinary.com/dbspkj6dy/image/upload/v1714813803/x36i4iozmkqsdpxwakq2.jpg")){
      await deleteImage();
    }
    const uploadedData = await imageUpload(); // Wait for image upload to finish
    const profileData = {
      username,
      bio,
      allergies,
      cookingExperience,
      foodPreference,
      profileImage: uploadedData.secure_url, // Use uploaded data's secure_url
    };
    await editProfile(username, profileData);
    navigate(`/profile/${username}`);
    window.location.reload();
  };
  useEffect(() => {
    fetchProfile(); // Fetch the logged-in user's profile when the component mounts
  }, []);
  const fetchProfile = async () => {
    // Fetch session info to get the logged-in user's username
    const sessionInfo = await axios.get(apis.USERS + "/session");
    const response = await axios.get(
      apis.PROFILES + `/${sessionInfo.data.username}`,
    );

    const publicId = response.data.profile.profileImage
      .split("/")
      .pop()
      .split(".")[0];
    console.log(response.data.profile.profileImage);
    if (response.status === 200) {
      setUsername(response.data.profile.username);
      setBio(response.data.profile.bio);
      setAllergies(response.data.profile.allergies);
      setCookingExperience(response.data.profile.cookingExperience);
      setFoodPreference(response.data.profile.foodPreference);
      setProfileImg(response.data.profile.profileImage);
      setPublicId(publicId);
    } else {
      console.error("Failed to fetch user");
    }
  };

  return (
    <div className="update-profile-container">
      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="update-profile-input-group">
          <div className="update-profile-photo">
            <div className="outer">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Uploaded" />
              ) : (
                <img src={profileImg} alt="Profile" />
              )}
              <div className="inner">
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="image-upload-input"
                />
                <label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="17"
                    viewBox="0 0 20 17"
                  >
                    <path
                      d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 
            11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 
            2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="update-profile-input-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="update-profile-input-group">
          <label htmlFor="cookingExperience">Cooking Experience</label>
          <select
            id="cookingExperience"
            value={cookingExperience}
            onChange={(e) => setCookingExperience(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div className="update-profile-input-group">
          <label htmlFor="allergies">Allergies</label>
          <input
            type="text"
            id="allergies"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          />
        </div>

        <div className="update-profile-input-group">
          <label htmlFor="foodPreference">Food Preference</label>
          <textarea
            id="foodPreference"
            value={foodPreference}
            onChange={(e) => setFoodPreference(e.target.value)}
          />
        </div>

        <button type="submit" className="update-profile-submit-button">
          Submit Change
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
