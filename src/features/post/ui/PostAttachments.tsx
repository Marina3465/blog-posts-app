import { Attachment } from "@/shared/types";
import { PaperClipIcon } from "@/shared/icons/PaperClipIcon";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/formatFileSize";
import { useState } from "react";
import { PlayIcon } from "@/shared/icons";
import { MediaLightbox } from "./MediaLightbox";

type Props = {
  attachments: Attachment[];
};

const isMedia = (file: Attachment) =>
  file.mimeType.startsWith("image/") || file.mimeType.startsWith("video/");

export const PostAttachments = ({ attachments }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (attachments.length === 0) return null;

  const media = attachments.filter(isMedia);
  const documents = attachments.filter((file) => !isMedia(file));

  const isSingle = media.length === 1;

  return (
    <div className="flex flex-col gap-2 my-2">
      {media.length > 0 && (
        <div className={cn("grid gap-2", !isSingle && "grid-cols-2")}>
          {media.map((file, index) => {
            const mediaClassName = cn(
              "rounded-2xl bg-gray-100",
              isSingle
                ? "max-h-96 max-w-full justify-self-start"
                : "h-48 w-full object-cover",
            );

            if (file.mimeType.startsWith("video/")) {
              return (
                <button
                  key={file.id}
                  className="relative block overflow-hidden bg-transparent"
                  onClick={() => setOpenIndex(index)}
                >
                  <video
                    src={file.url}
                    preload="metadata"
                    className={cn(mediaClassName, "bg-black")}
                  />
                  <PlayIcon className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-gray-800 cursor-pointer" />
                </button>
              );
            }

            return (
              <button
                key={file.id}
                className="relative block overflow-hidden bg-transparent"
                onClick={() => setOpenIndex(index)}
              >
                <img
                  key={file.id}
                  src={file.url}
                  alt={file.originalName}
                  loading="lazy"
                  className={mediaClassName}
                />
              </button>
            );
          })}
        </div>
      )}

      {documents.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target="_blank"
          rel="noreferrer"
          download={file.originalName}
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
        >
          <PaperClipIcon className="size-5 shrink-0 text-gray-500" />
          <span className="truncate font-medium" title={file.originalName}>
            {file.originalName}
          </span>
          <span className="ml-auto shrink-0 text-sm text-gray-500">
            {formatFileSize(file.size)}
          </span>
        </a>
      ))}

      {openIndex !== null && (
        <MediaLightbox
          files={media}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </div>
  );
};
