import { useState } from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "@shared/ui/IconButton";
import { CommentIcon, HeartIcon, ShareIcon } from "@shared/icons";

type Props = {
  likes: number;
  comments: number;
};

export const PostFooter = ({ likes, comments }: Props) => {
  const [isLike, setIsLike] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);

  const handleLikeClick = () => {
    setIsLike((prev) => !prev);
  };

  const handleCommentClick = () => {
    setIsOpenComments((prev) => !prev);
  };

  const likeCounter = isLike ? likes + 1 : likes;

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
          <span className="font-medium text-gray-500">{comments} comments</span>
        </IconButton>

        <IconButton icon={<ShareIcon className="size-5 text-gray-500" />}>
          <span className="font-medium text-gray-500">Share</span>
        </IconButton>
      </div>
    </div>
  );
};
