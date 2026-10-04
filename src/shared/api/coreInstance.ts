import axios from "axios";

export const coreInstance = axios.create({
  // Запросы идут на тот же origin, dev-сервер проксирует /api на бэкенд
  baseURL: "/api",
  withCredentials: true, // отправляем cookie сессии
});
