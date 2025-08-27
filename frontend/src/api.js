import axios from "axios";

const BACKEND_URL = "http://localhost:3000"; // change to your backend

export const post = async (url, data) => {
  try {
    const response = await axios.post(`${BACKEND_URL}${url}`, data);
    return response.data;
  } catch (err) {
    // throw backend error message or generic
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
  }
};
