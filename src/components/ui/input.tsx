import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Upload,
  Loader2,
  Ban,
  CalendarDays,
  FileText,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useId, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
function Input({
  className,
  type,
  error,
  errorMessage,
  id,
  label,
  disabled = false,
  isLoading = false,
  preview,
  onClearPreview,
  readOnly = false,
  ...props
}: React.ComponentProps<"input"> & {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  preview?: string;
  onClearPreview?: () => void;
  readOnly?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();

  const errorId = useId();
  const inputId = id || useId();

  const fileName = preview?.split("/").pop();

  return (
    <div className="relative">
      <div className="group relative flex">
        {type === "textarea" ? (
          <textarea
            {...props}
            id={inputId}
            readOnly={readOnly}
            placeholder={props.placeholder || " "}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={inputId}
            data-slot="textarea"
            className={cn(
              "peer h-25 md:h-40 max-h-70 min-h-25 md:min-h-40 w-full text-black bg-transparent px-0 py-1 text-[1.2rem] border-b border-black/20 outline-none transition-all placeholder:text-transparent placeholder:text-muted-foreground font-secondary font-light leading-[120%]",
              "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full",

              error === true && " border-[var(--brandRed)]",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              className,
            )}
          />
        ) : (
          <input
            {...props}
            id={inputId}
            readOnly={readOnly}
            placeholder={props.placeholder || " "}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            aria-invalid={error ? "true" : "false"}
            aria-describedby={inputId}
            data-slot="input"
            className={cn(
              "peer h-10 w-full text-black bg-transparent px-0 py-1 text-[1.2rem] border-b border-black/20 outline-none transition-all placeholder:text-transparent placeholder:text-muted-foreground",
              "font-secondary font-light",
              error === true && " border-[var(--brandRed)]",
              type === "password" || (type === "file" && "pe-7"),

              disabled &&
                "opacity-50 cursor-not-allowed pointer-events-none pe-7",
              readOnly && "pointer-events-none",
              className,
            )}
            dir={type === "date" ? "ltr" : props?.dir || i18n.dir()}
          />
        )}

        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute top-[.25rem] -translate-y-full text-[0.85rem] text-black/70 transition-all pointer-events-none leading-[100%]",

              type === "textarea"
                ? "peer-placeholder-shown:top-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[1.2rem]"
                : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[1.2rem]",

              "peer-focus:top-[.25rem] peer-focus:-translate-y-full peer-focus:text-[0.85rem]",
              "peer-autofill:top-[.25rem] peer-autofill:-translate-y-full peer-autofill:text-[0.85rem]",

              error === true &&
                "text-[var(--brandRed)] peer-focus:text-[var(--brandRed)] peer-placeholder-shown:text-[var(--brandRed)]",
              props.placeholder &&
                "peer-placeholder-shown:top-[.25rem] peer-placeholder-shown:-translate-y-full peer-placeholder-shown:text-[.85rem] peer-placeholder-shown:text-black/70",

              // props.dir
              //   ? props.dir === "rtl"
              //     ? "right-0 "
              //     : "left-0 "
              //   : "ltr:left-0 rtl:right-0 ",

              disabled && "opacity-50 cursor-not-allowed",
            )}
            // dir={props?.dir || i18n.dir()}
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

        {type === "date" && (
          <div
            onClick={() => document.getElementById(inputId)?.click()}
            className="absolute right-0  top-[50%] translate-y-[-50%] pointer-events-none cursor-pointer"
          >
            <CalendarDays className=" text-black/50 w-5 h-5" />
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
          <Label
            htmlFor={inputId}
            errorLabel={true}
            floating={true}
            role="alert"
          >
            {errorMessage || t("invalid-field")}
          </Label>
        )}
        {isLoading && (
          <div
            className={cn(
              "absolute ltr:right-0 rtl:left-0 top-[50%] translate-y-[-50%] cursor-wait opacity-20",
              type === "textarea" && "bottom-3 top-auto translate-y-[0%]",
            )}
          >
            <Loader2 className=" text-black/50 w-5 h-5 animate-spin" />
          </div>
        )}

        {disabled && (
          <div
            className={cn(
              "absolute ltr:right-0 rtl:left-0 top-[50%] translate-y-[-50%] cursor-wait opacity-20",
              type === "textarea" && "bottom-3 top-auto translate-y-[0%]",
            )}
          >
            <Ban className=" text-black/50 w-5 h-5 " />
          </div>
        )}
      </div>
      {preview && (
        <div className="mt-2 bg-muted-foreground/10  rounded-md flex  gap-2 w-full">
          <div
            className="flex items-center gap-2 flex-1 p-2 cursor-pointer"
            onClick={() => window.open(preview, "_blank")}
          >
            <FileText className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm line-clamp-1">
              {fileName}
            </span>
          </div>
          {!readOnly && onClearPreview && (
            <div
              className="group p-2 bg-[var(--brandRed)] rounded-r-md  flex items-center"
              onClick={onClearPreview}
            >
              <X className="size-4 text-white cursor-pointer group-hover:rotate-90 transition-all duration-300" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Input };
