export type Post = {
  id: number;
  author: string;
  userTag: string;
  text: string;
  likes: number;
  comments: number;
  dateOfCreation: string;
};

export type CreatePostParams = {
  author: string;
  userTag: string;
  text: string;
  dateOfCreation: string;
};
