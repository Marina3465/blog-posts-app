import { usePost } from "@/entities/post/usePost";
import { CreatePost } from "@/features/create-post/CreatePost";
import { PostCard } from "@/features/post/PostCard";
import { SearchUsers } from "@/features/search-users/SearchUsers";
import { Header } from "@/Header";
import { Post, User } from "@/shared/types";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

type Props = {
  user: User | null;
};

export default function ListOfPosts({ user }: Props) {
  const { posts, isLoading, error, getPosts, createPost } = usePost();

  const { tag } = useParams<{ tag: string }>();

  useEffect(() => {
    if (tag) {
      getPosts(tag);
    }
  }, [tag, getPosts]);

  if (isLoading) return <div>Загрузка постов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <>
      <Header />
      <main className="p-10 lg:px-60">
        <SearchUsers />
        {tag === user?.userTag && <CreatePost createPost={createPost} />}
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
