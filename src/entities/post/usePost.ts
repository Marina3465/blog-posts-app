import { Post } from "@/shared/types";
import { create } from "zustand";

export type CreatePostInput = Pick<Post, "text"> &
  Partial<Pick<Post, "author" | "userTag">>;

type Store = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  getPosts: () => Promise<void>;
  createPost: (newPost: CreatePostInput) => Promise<void>;
};

const API_URL = "http://localhost:5000/posts";

export const usePost = create<Store>()((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  getPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Не удалось загрузить посты");

      const posts: Post[] = await response.json();
      set({ posts, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Произошла ошибка",
        isLoading: false,
      });
    }
  },

  createPost: async (postData) => {
    if (!postData.text.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: postData.author || "Marina",
          userTag: postData.userTag || "@marinakv",
          text: postData.text,
        }),
      });

      if (!response.ok) throw new Error("Не удалось создать пост");

      const newPost: Post = await response.json();

      set((state) => ({
        posts: [newPost, ...state.posts],
      }));
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
    }
  },
}));
