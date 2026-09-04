export type Post = {
  id: number;
  author: string;
  userTag: string;
  text: string;
  likes: number;
  comments: number;
  dateOfCreation: Date;
};

export type CreatePostParams = {
  author: string;
  userTag: string;
  text: string;
  dateOfCreation: Date;
};
