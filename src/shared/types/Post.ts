export type Post = {
  id: number;
  author: string;
  userTag: string;
  text: string;
  likes: number;
  comments: number;
  dateOfCreation: string;
  likesCount: number;
  isLikedByMe: boolean;
};

export type CreatePostParams = {
  author: string;
  userTag: string;
  text: string;
  dateOfCreation: string;
};
