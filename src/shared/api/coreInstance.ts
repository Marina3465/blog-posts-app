import axios from "axios";

const CURRENT_USER_ID = "1";

export const coreInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    "x-user-id": CURRENT_USER_ID,
  },
});
