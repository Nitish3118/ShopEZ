import axios from "axios";

const API = axios.create({
  baseURL: "https://shopez-t95h.onrender.com"
});

export default API;