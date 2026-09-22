import { usePost } from "@/entities/post/usePost";
import { CreatePost } from "@/features/create-post/CreatePost";
import { PostCard } from "@/features/post/PostCard";
import { Header } from "@/Header";
import { Post } from "@/shared/types";
import { useEffect } from "react";

export default function ListOfPosts() {
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
            <div key={post.id} className="grid animate-post-appear">
              <div className="overflow-hidden">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
