import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useId, useRef, useState } from "react";

function Input({
  className,
  type,
  error,
  errorMessage,
  id,
  label,

  ...props
}: React.ComponentProps<"input"> & {
  error?: boolean;
  errorMessage?: string;
  label?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const errorId = useId();
  const inputId = id || useId();

  return (
    <div className="group relative flex">
      {type === "textarea" ? (
        <textarea
          {...props}
          id={inputId}
          placeholder={props.placeholder || " "}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          data-slot="textarea"
          className={cn(
            "peer h-25 md:h-40 max-h-70 min-h-25 md:min-h-40 w-full text-black bg-transparent px-0 py-1 text-[1.2rem] border-b border-black/20 outline-none transition-all placeholder:text-transparent placeholder:text-muted-foreground font-secondary font-light leading-[120%]",
            "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full",

            error === true && " border-[var(--brandRed)]",

            className,
          )}
        />
      ) : (
        <input
          {...props}
          id={inputId}
          placeholder={props.placeholder || " "}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          data-slot="input"
          className={cn(
            "peer h-10 w-full text-black bg-transparent px-0 py-1 text-[1.2rem] border-b border-black/20 outline-none transition-all placeholder:text-transparent placeholder:text-muted-foreground",
            "font-secondary font-light",
            error === true && " border-[var(--brandRed)]",
            type === "password" || (type === "file" && "pe-7"),

            className,
          )}
        />
      )}

      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "absolute  top-[.25rem] -translate-y-full text-[0.85rem] text-black/70 transition-all pointer-events-none leading-[100%]",

            type === "textarea"
              ? "peer-placeholder-shown:top-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[1.2rem] peer-placeholder-shown:text-black/70"
              : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[1.2rem] peer-placeholder-shown:text-black/70",

            "peer-focus:top-[.25rem] peer-focus:-translate-y-full peer-focus:text-[0.85rem] peer-focus:text-black/70",

            error === true &&
              "text-[var(--brandRed)] peer-focus:text-[var(--brandRed)] peer-placeholder-shown:text-[var(--brandRed)]",
            props.placeholder &&
              "peer-placeholder-shown:top-[.25rem] peer-placeholder-shown:-translate-y-full peer-placeholder-shown:text-[.85rem] peer-placeholder-shown:text-black/70",
            props.dir
              ? props.dir === "rtl"
                ? "right-0 "
                : "left-0 "
              : "ltr:left-0 rtl:right-0 ",
          )}
        >
          {label}
        </label>
      )}

      {type === "password" && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute ltr:right-0 rtl:left-0 top-[50%] translate-y-[-50%] cursor-pointer"
        >
          {showPassword ? (
            <Eye className=" text-black/50 w-5 h-5" />
          ) : (
            <EyeOff className=" text-black/50 w-5 h-5" />
          )}
        </div>
      )}

      {type === "file" && (
        <div
          onClick={() => document.getElementById(inputId)?.click()}
          className="absolute ltr:right-0 rtl:left-0 top-[50%] translate-y-[-50%] cursor-pointer"
        >
          <Upload className=" text-black/50 w-5 h-5" />
        </div>
      )}

      {error && (
        <span
          id={errorId}
          role="alert"
          className="absolute bottom-[-1px] ltr:right-0 rtl:left-0 bg-[var(--brandRed)] text-[.85rem] inline-flex leading-[100%] px-2 py-[2px] rounded-[3px] font-secondary translate-y-full"
        >
          {errorMessage || t("invalid-field")}
        </span>
      )}
    </div>
  );
}

export { Input };
