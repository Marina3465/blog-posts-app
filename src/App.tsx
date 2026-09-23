import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListOfPosts from "./pages/list-of-posts/ListOfPosts";
import { ErrorPage } from "./pages/protective/ErrorPage";
import { useUser } from "./entities/user/useUser";
import { useEffect } from "react";
import { ProtectivePage } from "./pages/protective/ProtectivePage";
import { HomeRedirect } from "./pages/protective/HomeRedirect";
import { Login } from "./pages/login/Login";

export default function App() {
  const { fetchMe, user, isAuthChecked } = useUser();

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={<ProtectivePage user={user} isAuthChecked={isAuthChecked} />}
        >
          <Route index element={<HomeRedirect user={user} />} />
          <Route path="/posts/:tag" element={<ListOfPosts />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
