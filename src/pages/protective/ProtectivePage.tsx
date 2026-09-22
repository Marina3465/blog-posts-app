import { User } from "@/shared/types";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  user: User | null;
  isAuthChecked: boolean;
};

export const ProtectivePage = ({ user, isAuthChecked }: Props) => {
  if (user === null && isAuthChecked) {
    return <Navigate to="login" />;
  }

  return <Outlet />;
};
