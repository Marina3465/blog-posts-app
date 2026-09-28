import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn";

type Props = ComponentPropsWithoutRef<"button">;

export const Button = ({ className, ...props }: Props) => {
  return (
    <button
      className={cn(
        "rounded-xl bg-rose-400 text-white font-semibold py-3 px-4 cursor-pointer",
        "transition-all duration-300 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-400 disabled:hover:shadow-none",
        className,
      )}
      {...props}
    />
  );
};
