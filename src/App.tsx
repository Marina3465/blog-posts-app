import { useEffect } from "react";
import { usePost } from "./entities/post/usePost";
import { CreatePost } from "./features/create-post/CreatePost";
import { PostCard } from "./features/post/PostCard";
import { Header } from "./Header";
import { type Post } from "./shared/types";

export default function App() {
  const { posts, isLoading, error, getPosts, createPost } = usePost();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (isLoading) return <div>Загрузка постов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <>
      <Header />
      <main className="p-10 lg:px-60">
        <CreatePost createPost={createPost} />
        <div className="grid gap-4">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
