import { Post } from "@/shared/types";
import { PostFooter } from "./ui/PostFooter";
import { PostHeader } from "./ui/PostHeader";

type Props = {
  post: Post;
};

export const PostCard = ({ post }: Props) => {
  const { author, text, likes, comments, userTag, dateOfCreation } = post;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6.5 pl-6 pb-2.5">
      <PostHeader
        author={author}
        userTag={userTag}
        dateOfCreation={dateOfCreation}
      />
      <div className="text-base/relaxed my-2">{text}</div>
      <PostFooter likes={likes} comments={comments} />
    </div>
  );
};
