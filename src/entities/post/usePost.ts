import { coreInstance, getErrorMessage } from "@/shared/api";
import { CreatePostParams, Post } from "@/shared/types";
import { create } from "zustand";

type Store = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  getPosts: () => Promise<void>;
  createPost: (newPost: CreatePostParams) => Promise<void>;
  toggleLike: (id: number) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
};

export const usePost = create<Store>()((set, get) => ({
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
        error: err instanceof Error ? err.message : "Error loading posts",
        isLoading: false,
      });
    }
  },

  createPost: async (postData) => {
    if (!postData.text.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", postData.text);
      postData.files.forEach((file) => formData.append("files", file));

      const response = await coreInstance.post<Post>("/posts", formData);

      set((state) => ({ posts: [response.data, ...state.posts] }));
    } catch (err) {
      console.error("Error creating post:", err);
    }
  },

  deletePost: async (id: number) => {
    // Убираем из списка сразу, но помним прежний порядок:
    // если сервер откажет, вернем пост на место
    const previousPosts = get().posts;

    set((state) => ({ posts: state.posts.filter((post) => post.id !== id) }));

    try {
      await coreInstance.delete(`/posts/${id}`);
    } catch (err) {
      set({
        posts: previousPosts,
        error: getErrorMessage(err, "Failed to delete the post"),
      });
      throw err;
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
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? toggleLikeLocally(post) : post,
        ),
      }));
      throw err;
    }
  },
}));
