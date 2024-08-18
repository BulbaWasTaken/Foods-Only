import axios from "../Helper/axiosInstance";
const API_URL = process.env.REACT_APP_API_URL + "/api/users";

/* 
  A helper function to help frontend communicate with backend.
  This function sends the form information to the backend.
*/
export const loginUser = async (user) => {
  try {
    const response = await axios.post(API_URL + "/login", user);
    alert("Logged in user :" + user.username);
    return response.data;
  } catch (error) {
    alert("Error logging in:");
    console.error("Error logging in:", error);
  }
};
