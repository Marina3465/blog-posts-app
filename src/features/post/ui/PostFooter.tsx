import { useState } from "react";
import { CommentIcon } from "../../../shared/icons/CommentIcon";
import { HeartIcon } from "../../../shared/icons/HeastIcon";
import { ShareIcon } from "../../../shared/icons/ShareIcon";
import { IconButton } from "../../../shared/ui/IconButton";
import { cn } from "../../../utils/cn";

const INITIAL_LIKES = 241;

export const PostFooter = () => {
  const [isLike, setIsLike] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);

  const handleLikeClick = () => {
    setIsLike((prev) => !prev);
  };

  const handleCommentClick = () => {
    setIsOpenComments((prev) => !prev);
  };

  const likeCounter = isLike ? INITIAL_LIKES + 1 : INITIAL_LIKES;

  return (
    <div>
      <hr className="w-full h-px bg-gray-200 border-none my-2" />
      <div className="flex gap-3">
        <IconButton
          icon={<HeartIcon className="size-5 text-rose-500" filled={isLike} />}
          className={cn("rounded-full py-1 px-2", isLike && "bg-rose-100")}
          onClick={handleLikeClick}
        >
          <span
            className={cn(
              "font-medium",
              isLike ? "text-rose-500" : "text-gray-500",
            )}
          >
            {likeCounter}
          </span>
        </IconButton>

        <IconButton
          icon={<CommentIcon className="size-5 text-gray-500" />}
          onClick={handleCommentClick}
          className={cn(isOpenComments && "bg-gray-100")}
        >
          <span className="font-medium text-gray-500">18 comments</span>
        </IconButton>

        <IconButton
          icon={<ShareIcon className="size-5 text-gray-500" filled />}
        >
          <span className="font-medium text-gray-500">Share</span>
        </IconButton>
      </div>
    </div>
  );
};
