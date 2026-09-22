import { Error404 } from "@/shared/icons";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <Error404 />
      <Link
        to={"/posts/@marinakv"}
        className="rounded-lg bg-rose-400 text-white font-semibold py-2 px-3 hover:bg-rose-500 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30"
      >
        Return to My page
      </Link>
    </div>
  );
};
