export type User = {
  id: number;
  name: string;
  userTag: string;
  email: string | null;
  avatar: string | null;
};

export type UserRegistration = {
  name: string;
  userTag: string;
  email: string;
  password: string;
};

export type UserLogIn = { login: string; password: string };
