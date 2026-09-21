import axios from "axios";

const CURRENT_USER_ID = "1";

export const coreInstance = axios.create({
  withCredentials: true, // отправляем cookie сессии
  headers: {
    "Content-Type": "application/json",
    "x-user-id": CURRENT_USER_ID,
  },
});
