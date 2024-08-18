import axios, { apis } from "../Helper/axiosInstance";

/*
  A helper function to communicate with backend for signing-up.
*/
export const signupUser = async (newUser) => {
  try {
    const response = await axios.post(apis.USERS + "/signup", newUser);
    alert("Signed up user :" + newUser.username);
    return response.data;
  } catch (error) {
    alert("Error signing up:");
    console.error("Error signing up:", error);
  }
};
