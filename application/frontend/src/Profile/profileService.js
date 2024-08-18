import axios, { apis } from "../Helper/axiosInstance";

export const makeProfile = async (profile) => {
  try {
    const response = await axios.post(apis.PROFILES + "/create", profile);
    return response.data;
  } catch (error) {
    alert("Error adding new user:" + error);
    console.error("Error logging in:", error);
  }
};

export const editProfile = async (username, profileData) => {
  try {
    const response = await axios.patch(
      apis.PROFILES + `/${username}`,
      profileData,
    );
    return response.data;
  } catch (error) {
    alert("Error uploading image:" + error);
    console.error("Error uploading image:", error);
  }
};
