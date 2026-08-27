import { CreatePost } from "./features/create-post/CreatePost";
import { Post } from "./features/post/Post";
import { Header } from "./Header";

export default function App() {
  return (
    <>
      <Header />
      <main className="p-10 lg:px-60">
        <CreatePost />
        <Post />
      </main>
    </>
  );
}
