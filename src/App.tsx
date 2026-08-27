import { Post } from "./features/post/Post";
import { Header } from "./Header";

export default function App() {
  return (
    <>
      <Header />
      <main className="p-10">
        <Post />
      </main>
    </>
  );
}
