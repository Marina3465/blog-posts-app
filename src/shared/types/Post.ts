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
  isMine: boolean;
};

export type CreatePostParams = {
  text: string;
};
