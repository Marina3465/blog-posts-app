import { Post } from "@/shared/types";
import { PaperClipIcon } from "@/shared/icons/PaperClipIcon";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/formatFileSize";

type Attachment = Post["attachments"][number];

type Props = {
  attachments: Post["attachments"];
};

const isMedia = (file: Attachment) =>
  file.mimeType.startsWith("image/") || file.mimeType.startsWith("video/");

export const PostAttachments = ({ attachments }: Props) => {
  if (attachments.length === 0) return null;

  // Картинки и видео идут сеткой, остальные файлы (pdf и т.д.) — списком ниже
  const media = attachments.filter(isMedia);
  const documents = attachments.filter((file) => !isMedia(file));

  // Одно изображение показываем в натуральных пропорциях,
  // несколько — ровной сеткой одинаковых плиток
  const isSingle = media.length === 1;

  return (
    <div className="flex flex-col gap-2 my-2">
      {media.length > 0 && (
        <div className={cn("grid gap-2", !isSingle && "grid-cols-2")}>
          {media.map((file) => {
            const mediaClassName = cn(
              "rounded-2xl bg-gray-100",
              isSingle
                ? "max-h-96 max-w-full justify-self-start"
                : "h-48 w-full object-cover",
            );

            if (file.mimeType.startsWith("video/")) {
              return (
                <video
                  key={file.id}
                  src={file.url}
                  controls
                  preload="metadata"
                  className={cn(mediaClassName, "bg-black")}
                />
              );
            }

            return (
              <img
                key={file.id}
                src={file.url}
                alt={file.originalName}
                loading="lazy"
                className={mediaClassName}
              />
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
    </div>
  );
};
