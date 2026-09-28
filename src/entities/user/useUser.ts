import axios from "axios";
import { coreInstance, getErrorMessage } from "@/shared/api";
import { User, UserLogIn, UserRegistration } from "@/shared/types";
import { create } from "zustand";

type Store = {
  user: User | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  fetchMe: () => Promise<void>;
  logIn: (params: UserLogIn) => Promise<void>;
  register: (params: UserRegistration) => Promise<void>;
  logOut: () => Promise<void>;
  clearError: () => void;
};

export const useUser = create<Store>()((set) => ({
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await coreInstance.get<User>("/auth/me");

      set({ user: response.data, isLoading: false, isAuthChecked: true });
    } catch (err) {
      // 401 — это не ошибка, а ответ "вы гость"
      const isUnauthorized =
        axios.isAxiosError(err) && err.response?.status === 401;

      set({
        user: null,
        error: isUnauthorized
          ? null
          : getErrorMessage(err, "Server unavailable"),
        isLoading: false,
        isAuthChecked: true,
      });
    }
  },

  logIn: async ({ login, password }: UserLogIn) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coreInstance.post<User>("/auth/login", {
        login,
        password,
      });

      set({ user: response.data, isLoading: false, isAuthChecked: true });
    } catch (err) {
      set({
        error: getErrorMessage(err, "Failed to sign in"),
        isLoading: false,
      });
    }
  },

  register: async (params: UserRegistration) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coreInstance.post<User>("/auth/register", params);

      set({ user: response.data, isLoading: false, isAuthChecked: true });
    } catch (err) {
      set({
        error: getErrorMessage(err, "Failed to register"),
        isLoading: false,
      });
    }
  },

  logOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await coreInstance.get("/auth/logout");

      set({ user: null, isLoading: false });
    } catch (err) {
      set({
        error: getErrorMessage(err, "Failed to sign out"),
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
