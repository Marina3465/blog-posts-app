import { coreInstance } from "@/shared/api";
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

export const usePost = create<Store>()((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  getPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await coreInstance.get<Post[]>("/posts");

      set({ posts: response.data, isLoading: false });
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
      const response = await coreInstance.post<Post>("/posts", {
        author: postData.author || "Marina",
        userTag: postData.userTag || "@marinakv",
        text: postData.text,
      });

      set((state) => ({ posts: [response.data, ...state.posts] }));
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
    }
  },

  toggleLike: async (id: number) => {
    const toggleLikeLocally = (post: Post): Post => ({
      ...post,
      likesCount: post.isLikedByMe ? post.likesCount - 1 : post.likesCount + 1,
      isLikedByMe: !post.isLikedByMe,
    });

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? toggleLikeLocally(post) : post,
      ),
    }));

    try {
      const response = await coreInstance.post<{
        postId: number;
        likesCount: number;
        isLikedByMe: boolean;
      }>(`/posts/${id}/like`);

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id
            ? {
                ...post,
                likesCount: response.data.likesCount,
                isLikedByMe: response.data.isLikedByMe,
              }
            : post,
        ),
      }));
    } catch (err) {
      // Откатываем оптимистичное обновление, если запрос не удался
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? toggleLikeLocally(post) : post,
        ),
      }));
      throw err;
    }
  },
}));
