
import axiosInstance, { apis } from "../Helper/axiosInstance";

export const isAuthenticated = async () => {
  try {
    const sessionInfo = await axiosInstance.get(apis.USERS + "/getAuthStatus");
    if (sessionInfo.data.username !== null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};
