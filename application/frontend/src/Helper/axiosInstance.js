import axios from "axios";
import * as apis from "./APIs";

const API_KEY = process.env.REACT_APP_API_KEY;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.defaults.withCredentials = true;

instance.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;

const spoonacularAxiosInstance = axios.create({
  baseURL: "https://api.spoonacular.com/recipes",
});

export { apis, spoonacularAxiosInstance};
export default instance;
