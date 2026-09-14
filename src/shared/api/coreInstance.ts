import axios from "axios";

const API_URL = "http://localhost:5000";
const CURRENT_USER_ID = "1";

export const coreInstance = axios.create({
  baseURL: API_URL, // Ваша база API (опционально)
  headers: {
    "Content-Type": "application/json",
    "x-user-id": CURRENT_USER_ID,
  },
});
