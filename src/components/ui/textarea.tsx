import * as React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

function Textarea({
  className,
  label,
  id,
  error,
  errorMessage,
  ...props
}: React.ComponentProps<"textarea"> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}) {
  const { t } = useTranslation();
  const errorId = useId();
  const inputId = id || useId();
  return (
    <div className="group relative">
      <textarea
        {...props}
        id={inputId}
        placeholder={props.placeholder || " "}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        data-slot="textarea"
        className={cn(
          "peer h-25 md:h-40 max-h-70 min-h-25 md:min-h-40 w-full text-black bg-transparent px-0 py-1 text-[1.2rem] border-b border-black/20 outline-none transition-all placeholder:text-transparent placeholder:text-muted-foreground",

          className,
        )}
      />
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "absolute  top-[.25rem] -translate-y-full text-[0.85rem] text-black/70 transition-all pointer-events-none leading-[100%]",

            "peer-placeholder-shown:top-5 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[1.2rem] peer-placeholder-shown:text-black/70",

            "peer-focus:top-[.25rem] peer-focus:-translate-y-full peer-focus:text-[0.85rem] peer-focus:text-black/70",

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

export { Textarea };
