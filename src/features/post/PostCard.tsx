import { Post } from "@/shared/types";
import { usePost } from "@/entities/post/usePost";
import { DeletePostButton } from "./ui/DeletePostButton";
import { PostFooter } from "./ui/PostFooter";
import { PostHeader } from "./ui/PostHeader";
import { PostAttachments } from "./ui/PostAttachments";

type Props = {
  post: Post;
};

export const PostCard = ({ post }: Props) => {
  const {
    id,
    author,
    text,
    comments,
    userTag,
    dateOfCreation,
    isLikedByMe,
    likesCount,
    isMine,
    attachments,
  } = post;

  const deletePost = usePost((state) => state.deletePost);

  const handleDelete = () => {
    deletePost(id).catch((error) => {
      console.error("Ошибка при удалении поста:", error);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6.5 pl-6 pb-2.5">
      <div className="flex justify-between items-start">
        <PostHeader
          author={author}
          userTag={userTag}
          dateOfCreation={dateOfCreation}
        />

        {isMine && <DeletePostButton onDelete={handleDelete} />}
      </div>

      <div className="text-base/relaxed my-2">{text}</div>

      <PostAttachments attachments={attachments} />

      <PostFooter
        postId={id}
        isLikedByMe={isLikedByMe}
        likesCount={likesCount}
        comments={comments}
      />
    </div>
  );
};
