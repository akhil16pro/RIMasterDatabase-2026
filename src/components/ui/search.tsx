import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Spinner } from "./spinner";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useId } from "react";
export const SearchBox = ({
  id,
  icon,
  size = "md",
  className = "",
  variant = "default",
  isLoading = false,
  iconGradient = "default",
  value,
  onChange,
  onClear,
  onSearch,
  ...props
}: {
  id?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  variant?: "default" | "shade" | "dark";
  isLoading?: boolean;
  iconGradient?: "default" | "edit" | "delete" | "gray";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
}) => {
  const inputId = id || useId();
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "w-full md:w-auto inline-flex h-10 px-4 rounded-lg items-center justify-center gap-2 text-secondary font-regular font-secondary border border-secondary/10 cursor-pointer group overflow-hidden relative ",

        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-lg",
        size === "lg" && "h-13 px-5 text-xl",
        size === "icon" && " w-12 p-0 ",
        "pe-8",
        variant === "shade" &&
          "border-none text-secondary bg-[linear-gradient(26deg,rgba(2,46,228,.3)_-5%,rgba(3,203,255,.3)_101%)]",
        variant === "dark" &&
          "border-[#022EE4] bg-[linear-gradient(26deg,#022EE4_-24.52%,#03CBFF_147%)] font-medium font-secondary text-white",
        variant === "default" &&
          "bg-[linear-gradient(100deg,#03CBFF_0%,#022EE4_120%)] border-none text-[var(--textColor)] font-medium",

        iconGradient === "delete" &&
          "bg-[linear-gradient(60deg,#FFC99D_-0%,#F07067_100%)] border-none",
        iconGradient === "gray" &&
          "bg-[linear-gradient(100deg,#a1a1a1_0%,#7a7a7a_100%)] border-none",
        iconGradient === "view" &&
          "bg-[linear-gradient(100deg,var(--color-success-100)_0%,var(--color-success)_120%)] border-none",
        className,
      )}
    >
      {variant === "default" && (
        <span
          className={cn(
            "absolute md:inset-[2px] inset-[1px] bg-white z-0 rounded-[calc(.7rem-2px)]",
          )}
        ></span>
      )}

      <span
        className={cn(
          "relative inline-block",
          variant === "default" && "text-secondary",
        )}
      >
        {icon || <Search className="size-5" />}
      </span>

      <input
        value={value}
        id={inputId}
        placeholder={props.placeholder || t("search")}
        data-slot="search"
        className={cn(
          "peer h-10 w-full text-black bg-transparent px-0 py-1 text-[1.2rem] border-b border-black/20 outline-none transition-all placeholder:text-transparent placeholder:text-muted-foreground",
          "font-secondary font-light text-[var(--textColor)] z-10 ",
          className,
        )}
        onChange={(e) => {
          if (e.target.value.length > 0) {
            onChange?.(e);
          } else {
            onClear?.();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.(e.target.value);
          }
        }}
        {...props}
      />
      {value && (
        <button
          onClick={() => {
            onClear?.();
          }}
          className="absolute ltr:right-2 rtl:left-2 top-[50%] translate-y-[-50%] cursor-pointer text-muted-foreground z-15"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};
