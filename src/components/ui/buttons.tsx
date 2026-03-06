import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Spinner } from "./spinner";

export const DefaultButton = ({
  title,
  icon,
  type = "button",
  size = "md",
  className = "",
  endContent,
  variant = "default",
  props,
  onClick,
  isLoading = false,
  isDisabled = false,
  rounded = false,
  iconGradient = "default",
}: {
  title?: string;
  icon: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  endContent?: React.ReactNode;
  variant?: "default" | "shade" | "dark";
  props?: React.ComponentProps<typeof motion.button>;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  rounded?: boolean;
  iconGradient?: "default" | "edit" | "delete";
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick && onClick}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      layout
      className={cn(
        "inline-flex h-10 px-4 rounded-lg items-center justify-center gap-2 text-secondary font-regular font-secondary border border-secondary/10 cursor-pointer group overflow-hidden relative ",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-lg",
        size === "lg" && "h-13 px-5 text-xl",
        size === "icon" && " w-12  p-0 ",
        variant === "shade" &&
          "border-none text-secondary  bg-[linear-gradient(26deg,rgba(2,46,228,.3)_-5%,rgba(3,203,255,.3)_101%)]",
        variant === "dark" &&
          "border-[#022EE4] bg-[linear-gradient(26deg,#022EE4_-24.52%,#03CBFF_147%)] font-medium font-secondary text-white",
        variant === "default" &&
          "bg-[linear-gradient(100deg,#03CBFF_0%,#022EE4_120%)] border-none text-[var(--textColor)] font-medium",
        rounded === true && " px-0 aspect-square rounded-full",

        iconGradient === "delete" &&
          "bg-[linear-gradient(60deg,#FFC99D_-0%,#F07067_100%)]",
        className,
      )}
      {...props}
    >
      {variant === "default" && (
        <span
          className={cn(
            "absolute md:inset-[2px] inset-[1px]  bg-white z-0  rounded-[calc(.7rem-2px)] ",
            rounded === true && " rounded-full",
          )}
        ></span>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {icon ? (
            <span
              className={cn(
                "relative inline-block",
                variant === "default" && "text-secondary",
              )}
            >
              {icon}
            </span>
          ) : null}
          {title ? (
            <span
              className={cn(
                "relative text-base md:text-lg inline-block leading-[100%]",
                size === "lg" && "text-[1.2rem]  md:text-[1.3rem]",
              )}
            >
              {title}
            </span>
          ) : null}
          {endContent ? (
            <span className="relative inline-block">{endContent}</span>
          ) : null}
        </>
      )}
    </motion.button>
  );
};
