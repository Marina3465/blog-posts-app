import { CreatePostParams, Post } from "@/shared/types";
import { create } from "zustand";

type Store = {
  posts: Post[];
  createPost: (newPost: CreatePostParams) => void;
};

const INITIAL_POST: Post = {
  id: 1,
  author: "Marina",
  userTag: "@marinakv",
  text: "My first post",
  likes: 5,
  comments: 2,
  dateOfCreation: new Date("2026-09-01"),
};

export const usePost = create<Store>()((set) => ({
  posts: [INITIAL_POST],
  createPost: (newPost: CreatePostParams) => {
    if (newPost.text.trim() === "") return;

    set((state) => ({
      posts: [
        { ...newPost, id: state.posts.length, likes: 0, comments: 0 },
        ...state.posts,
      ],
    }));
  },
}));
