import { Dispatch, SetStateAction, useEffect } from "react";
import { createPortal } from "react-dom";
import { Attachment } from "@/shared/types";
import { IconButton } from "@/shared/ui/IconButton";
import { CrossIcon } from "@/shared/icons/CrossIcon";
import { ArrowUpIcon } from "@/shared/icons";

type Props = {
  files: Attachment[];
  index: number;
  onClose: () => void;
  onIndexChange: Dispatch<SetStateAction<number | null>>;
};

export const MediaLightbox = ({
  files,
  index,
  onClose,
  onIndexChange,
}: Props) => {
  const file = files[index];
  const isVideo = file.mimeType.startsWith("video/");
  const next = (index + 1) % files.length;
  const prev = (index - 1 + files.length) % files.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(next);
      if (e.key === "ArrowLeft") onIndexChange(prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, files.length, onClose, onIndexChange]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={file.originalName}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <IconButton
        aria-label="Close"
        icon={<CrossIcon className="size-6" />}
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      />
      {files.length > 1 && (
        <>
          <IconButton
            aria-label="Previous"
            icon={<ArrowUpIcon className="size-6 -rotate-90" />}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(prev);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 text-white hover:bg-white/20"
          />
          <IconButton
            aria-label="Next"
            icon={<ArrowUpIcon className="size-6 rotate-90" />}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(next);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 text-white hover:bg-white/20"
          />
        </>
      )}

      {isVideo ? (
        <video
          key={file.id}
          src={file.url}
          controls
          autoPlay
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] max-w-[90vw]"
        />
      ) : (
        <img
          key={file.id}
          src={file.url}
          alt={file.originalName}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      )}
    </div>
  );

  return createPortal(overlay, document.body);
};
