import { useState } from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "@shared/ui/IconButton";
import { CommentIcon, HeartIcon, ShareIcon } from "@shared/icons";
import { usePost } from "@/entities/post/usePost";

type Props = {
  postId: number;
  isLikedByMe: boolean;
  likesCount: number;
  comments: number;
};

export const PostFooter = ({
  postId,
  isLikedByMe,
  likesCount,
  comments,
}: Props) => {
  const [isOpenComments, setIsOpenComments] = useState(false);
  const toggleLike = usePost((state) => state.toggleLike);

  const handleLikeClick = () => {
    toggleLike(postId).catch((error) => {
      console.error("Ошибка при постановке лайка:", error);
    });
  };

  const handleCommentClick = () => {
    setIsOpenComments((prev) => !prev);
  };

  return (
    <div>
      <hr className="w-full h-px bg-gray-200 border-none my-2" />
      <div className="flex gap-3">
        <IconButton
          icon={
            <HeartIcon className="size-5 text-rose-500" filled={isLikedByMe} />
          }
          className={cn("rounded-full py-1 px-2", isLikedByMe && "bg-rose-100")}
          onClick={handleLikeClick}
        >
          <span
            className={cn(
              "font-medium",
              isLikedByMe ? "text-rose-500" : "text-gray-500",
            )}
          >
            {likesCount}
          </span>
        </IconButton>

        <IconButton
          icon={<CommentIcon className="size-5 text-gray-500" />}
          onClick={handleCommentClick}
          className={cn(isOpenComments && "bg-gray-100")}
        >
          <span className="font-medium text-gray-500">{comments} comments</span>
        </IconButton>

        <IconButton icon={<ShareIcon className="size-5 text-gray-500" />}>
          <span className="font-medium text-gray-500">Share</span>
        </IconButton>
      </div>
    </div>
  );
};
