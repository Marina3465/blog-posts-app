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
  attachments: Attachment[];
};

export type Attachment = {
  id: number;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type CreatePostParams = {
  text: string;
  files: File[];
};
