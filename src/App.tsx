import { Blog } from "./features/blog/Blog";
import { Header } from "./Header";

export default function App() {
  return (
    <>
      <Header />
      <main className="p-10">
        <Blog />
      </main>
    </>
  );
}
