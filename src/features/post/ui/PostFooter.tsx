import { startTransition, useOptimistic, useState } from "react";
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

  const [{ countOfLikes, isLiked }, setOptimisticState] = useOptimistic(
    { countOfLikes: likesCount, isLiked: isLikedByMe },
    (current) => ({
      countOfLikes: current.isLiked
        ? current.countOfLikes - 1
        : current.countOfLikes + 1,
      isLiked: !current.isLiked,
    }),
  );

  const handleLikeClick = () => {
    startTransition(async () => {
      setOptimisticState(null);

      try {
        await toggleLike(postId);
      } catch (error) {
        console.error("Ошибка при постановке лайка:", error);
      }
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
          icon={<HeartIcon className="size-5 text-rose-500" filled={isLiked} />}
          className={cn("rounded-full py-1 px-2", isLiked && "bg-rose-100")}
          onClick={handleLikeClick}
        >
          <span
            className={cn(
              "font-medium",
              isLiked ? "text-rose-500" : "text-gray-500",
            )}
          >
            {countOfLikes}
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
