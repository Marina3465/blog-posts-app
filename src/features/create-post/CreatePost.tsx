import { useState } from "react";
import { CreatePostButton } from "./ui/CreatePostButton";
import { IconButton } from "@/shared/ui/IconButton";
import { PaperClipIcon } from "@/shared/icons/PaperClipIcon";
import { ArrowUpIcon } from "@/shared/icons/ArrowUpIcon";

export const CreatePost = () => {
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);

  const handleOpenForm = () => {
    setIsOpenCreateForm(true);
  };

  if (!isOpenCreateForm) return <CreatePostButton onClick={handleOpenForm} />;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xs mb-5">
      <div className="py-3 px-4.5 border-b border-gray-200">
        <span className="font-semibold">New post</span>
      </div>
      <div className="py-3 px-4.5">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium
          corporis natus, cum necessitatibus minima ad et? Ipsam harum
          consequatur labore? Voluptas voluptatum et odit nulla dicta maiores
          cupiditate excepturi nihil!
        </p>
      </div>
      <div className="flex justify-between bg-gray-50 py-3 px-4.5 border-t border-gray-200 rounded-b-3xl">
        <IconButton
          icon={<PaperClipIcon className="size-4" />}
          className="border border-gray-300"
        >
          Attach a file
        </IconButton>
        <IconButton
          icon={<ArrowUpIcon className="rotate-45 size-4" />}
          className="bg-orange-500 text-white"
        >
          Publish
        </IconButton>
      </div>
    </div>
  );
};
