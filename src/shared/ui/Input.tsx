import { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ type = "text", className, ...props }: Props) => {
  return (
    <input
      type={type}
      className={cn(
        "bg-white py-3 px-4 border border-gray-200 rounded-xl text-sm w-80",
        "outline-none transition-colors focus:border-rose-400",
        "disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
};
