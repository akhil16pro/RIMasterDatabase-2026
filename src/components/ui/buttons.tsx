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
}: {
  title: string;
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
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick && onClick}
      layout
      className={cn(
        "inline-flex h-10 px-4 rounded-lg items-center justify-center gap-2 text-secondary font-regular font-secondary border border-secondary/10 cursor-pointer group overflow-hidden relative transition-all duration-300 hover:text-text",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-lg",
        size === "lg" && "h-13 px-5 text-xl",
        size === "icon" && " w-12  p-0 ",
        variant === "shade" &&
          "bg-text/15 border border-text/8 text-text hover:bg-text/30 hover:border-text/15",
        variant === "dark" &&
          "border-[#022EE4] bg-[linear-gradient(26deg,#022EE4_-24.52%,#03CBFF_147%)] font-medium font-secondary text-white",
        className,
      )}
      {...props}
    >
      {variant === "default" ? (
        <span className="absolute left-0 top-0 w-full h-full bg-linear-to-r from-secondary to-primary z-0 opacity-33 transition-all duration-200 group-hover:opacity-75"></span>
      ) : null}

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {icon ? <span className="relative inline-block">{icon}</span> : null}
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
