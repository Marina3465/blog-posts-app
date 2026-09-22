import { coreInstance } from "@/shared/api";
import { User, UserLogIn, UserRegistration } from "@/shared/types";
import { create } from "zustand";

type Store = {
  user: User | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  fetchMe: () => Promise<void>;
  logIn: ({ login, password }: UserLogIn) => Promise<void>;
  register: (params: UserRegistration) => Promise<void>;
  logOut: () => Promise<void>;
};

export const useUser = create<Store>()((set) => ({
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await coreInstance.get<User | null>("/auth/me");

      set({ user: response.data, isLoading: false, isAuthChecked: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error loading posts",
        isLoading: false,
        isAuthChecked: true,
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

  logOut: async () => {
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
