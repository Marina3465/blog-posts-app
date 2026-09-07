import { CreatePostParams, Post } from "@/shared/types";
import { create } from "zustand";

type Store = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  getPosts: () => Promise<void>;
  createPost: (newPost: CreatePostParams) => Promise<void>;
  toggleLike: (id: number) => Promise<void>;
};

const API_URL = "http://localhost:5000/posts";
const CURRENT_USER_ID = "1";

export const usePost = create<Store>()((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  getPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL, {
        headers: { "x-user-id": CURRENT_USER_ID },
      });
      if (!response.ok) throw new Error("Не удалось загрузить посты");

      const posts: Post[] = await response.json();
      set({ posts, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Ошибка загрузки",
        isLoading: false,
      });
    }
  },

  createPost: async (postData) => {
    if (!postData.text.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": CURRENT_USER_ID,
        },
        body: JSON.stringify({
          author: postData.author || "Marina",
          userTag: postData.userTag || "@marinakv",
          text: postData.text,
        }),
      });

      if (!response.ok) throw new Error("Не удалось создать пост");

      const newPost: Post = await response.json();
      set((state) => ({ posts: [newPost, ...state.posts] }));
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
    }
  },

  toggleLike: async (id: number) => {
    const response = await fetch(`${API_URL}/${id}/like`, {
      method: "POST",
      headers: { "x-user-id": CURRENT_USER_ID },
    });

    if (!response.ok) throw new Error("Не удалось обновить лайк");

    const data: { postId: number; likesCount: number; isLikedByMe: boolean } =
      await response.json();

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? {
              ...post,
              likesCount: data.likesCount,
              isLikedByMe: data.isLikedByMe,
            }
          : post,
      ),
    }));
  },
}));
