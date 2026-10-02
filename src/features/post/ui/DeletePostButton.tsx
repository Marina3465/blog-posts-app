import { useState } from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "@/shared/ui/IconButton";
import { TrashIcon } from "@/shared/icons";

type Props = {
  onDelete: () => void;
};

export const DeletePostButton = ({ onDelete }: Props) => {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    // Оба состояния лежат в одной ячейке грида и перетекают друг в друга,
    // поэтому карточка не дергается по высоте
    <div className="grid *:col-start-1 *:row-start-1 justify-items-end">
      <div
        className={cn(
          "origin-right transition-all duration-300 ease-out",
          isConfirming && "scale-90 opacity-0",
        )}
        inert={isConfirming}
      >
        <IconButton
          icon={<TrashIcon className="size-5" />}
          onClick={() => setIsConfirming(true)}
          aria-label="Delete post"
          className="text-gray-400 transition-colors hover:text-rose-500 hover:bg-rose-50"
        />
      </div>

      <div
        className={cn(
          "grid origin-right transition-all duration-300 ease-out",
          isConfirming
            ? "grid-cols-[1fr]"
            : "grid-cols-[0fr] scale-90 opacity-0",
        )}
        inert={!isConfirming}
      >
        <div className="overflow-hidden">
          <div className="flex items-center gap-1 whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 py-1 pr-1 pl-3">
            <span className="text-sm font-medium text-rose-900/60">
              Delete?
            </span>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white cursor-pointer transition-all duration-300 hover:bg-rose-600 hover:shadow-md hover:shadow-rose-500/30"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="rounded-full px-3 py-1 text-sm font-semibold text-gray-500 cursor-pointer transition-colors hover:bg-white"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
