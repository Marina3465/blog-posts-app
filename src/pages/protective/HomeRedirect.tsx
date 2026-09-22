import { User } from "@/shared/types";
import { Navigate } from "react-router-dom";

type Props = {
  user: User | null;
};

export const HomeRedirect = ({ user }: Props) => {
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={`/posts/${user.userTag}`} replace />;
};
