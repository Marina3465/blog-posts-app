import { ReactNode, ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

interface Props extends ComponentPropsWithoutRef<"button"> {
  icon: ReactNode;
}

export const IconButton = ({ icon, children, className, ...props }: Props) => {
  return (
    <button
      className={cn(
        "flex gap-2 items-center rounded-full py-1 px-2 cursor-pointer",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
