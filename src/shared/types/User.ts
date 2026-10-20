export type User = {
  id: number;
  name: string;
  userTag: string;
  email: string | null;
  avatar: string | null;
};

// То, что приходит в результатах поиска: без email и прочего приватного
export type UserPreview = Pick<User, "id" | "name" | "userTag" | "avatar">;

export type UserRegistration = {
  name: string;
  userTag: string;
  email: string;
  password: string;
};

export type UserLogIn = { login: string; password: string };
