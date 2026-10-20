import { User } from "../types";

type Props = {
  user: Pick<User, "name" | "avatar"> | null;
};

export const Avatar = ({ user }: Props) => {
  if (!user) return null;

  return user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="size-9 rounded-full object-cover"
    />
  ) : (
    <span className="size-9 rounded-full bg-linear-to-br from-(--color-orange) to-(--color-rose) text-white font-semibold flex items-center justify-center">
      {user.name.slice(0, 1).toUpperCase()}
    </span>
  );
};
