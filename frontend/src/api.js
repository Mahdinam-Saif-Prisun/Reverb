import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const get = async (path) => {
  const res = await axios.get(`${BACKEND_URL}${path}`);
  return res.data;
};

export const post = async (path, body) => {
  const res = await axios.post(`${BACKEND_URL}${path}`, body);
  return res.data;
};
