import { ChangeEvent, useRef, useState } from "react";
import { CreatePostButton } from "./ui/CreatePostButton";
import { IconButton } from "@/shared/ui/IconButton";
import { PaperClipIcon } from "@/shared/icons/PaperClipIcon";
import { ArrowUpIcon } from "@/shared/icons/ArrowUpIcon";
import { CrossIcon } from "@/shared/icons/CrossIcon";
import { CreatePostParams } from "@/shared/types";

type Props = {
  createPost: (newPost: CreatePostParams) => void;
};

export const CreatePost = ({ createPost }: Props) => {
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [postText, setPostText] = useState("");

  const handleOpenForm = () => {
    setIsOpenCreateForm(true);
  };

  const handleCloseForm = () => {
    setIsOpenCreateForm(false);
    setPostText("");
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    createPost({
      author: "Marina",
      userTag: "@marinakv",
      text: postText,
      dateOfCreation: String(new Date()),
    });

    handleCloseForm();
  };

  if (!isOpenCreateForm) return <CreatePostButton onClick={handleOpenForm} />;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xs mb-5">
      <div className="py-3 px-4.5 border-b border-gray-200 flex items-center justify-between">
        <span className="font-semibold">New post</span>
        <IconButton
          icon={<CrossIcon className="font-normal size-5 text-gray-500" />}
          onClick={handleCloseForm}
        ></IconButton>
      </div>
      <textarea
        ref={textareaRef}
        className="py-3 px-4.5 w-full min-h-20 items-start outline-0 resize-none"
        placeholder="Write down your thoughts ..."
        value={postText}
        onChange={handleInput}
        rows={1}
      />
      <div className="flex justify-between bg-gray-50 py-3 px-4.5 border-t border-gray-200 rounded-b-3xl">
        <IconButton
          icon={<PaperClipIcon className="size-4" />}
          className="border border-gray-300 px-3 font-semibold transition-all duration-300 hover:bg-white hover:shadow-md"
        >
          Attach a file
        </IconButton>
        <IconButton
          icon={<ArrowUpIcon className="rotate-45 size-4" strokeWidth={"3"} />}
          className="bg-orange-500 text-white px-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
          onClick={handleSubmit}
        >
          Publish
        </IconButton>
      </div>
    </div>
  );
};
