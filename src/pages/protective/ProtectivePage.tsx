import { User } from "@/shared/types";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  user: User | null;
  isAuthChecked: boolean;
};

export const ProtectivePage = ({ user, isAuthChecked }: Props) => {
  if (!isAuthChecked) {
    return (
      <div className="h-dvh flex justify-center items-center text-[#767676]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
