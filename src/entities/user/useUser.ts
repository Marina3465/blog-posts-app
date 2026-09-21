import { coreInstance } from "@/shared/api";
import { User, UserLogIn, UserRegistration } from "@/shared/types";
import { create } from "zustand";

type Store = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export const useUser = create<Store>()((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await coreInstance.get<User>("/auth/me");

      set({ user: response.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error loading posts",
        isLoading: false,
      });
    }
  },

  logIn: async ({ login, password }: UserLogIn) => {
    if (!login.trim() || !password.trim()) return;

    try {
      const response = await coreInstance.post<User>("/auth/login", {
        login,
        password,
      });

      set({ user: response.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error log in",
        isLoading: false,
      });
    }
  },

  register: async (params: UserRegistration) => {
    if (
      !params.name.trim() ||
      !params.userTag.trim() ||
      !params.email.trim() ||
      !params.password.trim()
    )
      return;

    try {
      const response = await coreInstance.post<User>("/auth/login", {
        params,
      });

      set({ user: response.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error log in",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await coreInstance.get<User>("/auth/me");

      set({ user: null, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error loading posts",
        isLoading: false,
      });
    }
  },
}));
