import { useEffect, useState } from "react";
import { IconButton } from "@/shared/ui/IconButton";
import { PaperClipIcon } from "@/shared/icons/PaperClipIcon";
import { CrossIcon } from "@/shared/icons/CrossIcon";

type Props = {
  file: File;
  onRemove: () => void;
};

export const FilePreview = ({ file, onRemove }: Props) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="flex w-24 flex-col gap-1">
      <div className="relative size-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
        {isImage && url && (
          <img src={url} alt={file.name} className="size-full object-cover" />
        )}

        {isVideo && url && (
          <video src={url} muted className="size-full object-cover" />
        )}

        {!isImage && !isVideo && (
          <div className="size-full flex items-center justify-center">
            <PaperClipIcon className="size-6 text-gray-500" />
          </div>
        )}

        <IconButton
          icon={<CrossIcon className="size-4" />}
          className="absolute top-1 right-1 bg-white/80 p-0.5"
          onClick={onRemove}
        />
      </div>

      <span className="truncate text-xs text-gray-600" title={file.name}>
        {file.name}
      </span>
    </div>
  );
};
