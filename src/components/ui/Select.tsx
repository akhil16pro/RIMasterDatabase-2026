import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

// Added dir prop to the Root if you want to force RTL/LTR locally
export const Select = SelectPrimitive.Root;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
  hasValue?: boolean;
  dir?: "ltr" | "rtl";
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      label,
      error,
      errorMessage,
      isLoading,
      hasValue,
      dir,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();

    // Determine if we are in RTL mode to flip icons/labels
    const isRtl = dir === "rtl";

    return (
      <div className="group relative flex w-full">
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "peer flex h-10 w-full items-center justify-between border-b border-black/20 bg-transparent py-1 text-[1.2rem] outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 text-black font-secondary font-light",
            "text-start", // Ensures text aligns to the start (right for RTL, left for LTR)
            error && "border-[var(--brandRed)]",
            className,
          )}
          {...props}
          dir={dir}
        >
          {children}
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        {label && (
          <label
            className={cn(
              "absolute transition-all pointer-events-none leading-[100%] font-secondary",
              // Logic for LTR vs RTL alignment
              "ltr:left-0 rtl:right-0",

              "top-[.25rem] -translate-y-full text-[0.85rem]",

              "peer-focus:top-[.25rem] peer-focus:-translate-y-full peer-focus:text-[0.85rem]",

              "text-black/70",
              error &&
                "text-[var(--brandRed)] peer-focus:text-[var(--brandRed)]",
            )}
          >
            {label}
          </label>
        )}

        {error && (
          <span
            id={errorId}
            role="alert"
            className={cn(
              "absolute bottom-[-1px] bg-[var(--brandRed)] text-[.85rem] inline-flex leading-[100%] px-2 py-[2px] rounded-[3px] font-secondary translate-y-full text-white",
              "ltr:right-0 rtl:left-0", // Error badge sits on the opposite side of the label
            )}
          >
            {errorMessage || "Invalid selection"}
          </span>
        )}

        {isLoading && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 opacity-20",
              "ltr:right-6 rtl:left-6",
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    );
  },
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectContentProps
>(({ className, children, position = "popper", dir, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      dir={dir}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md animate-in fade-in-80 zoom-in-95",
        position === "popper" && "translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-8 text-[1rem] outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary",
      "text-start justify-start",
      className,
    )}
    {...props}
  >
    <span className="absolute ltr:left-2 rtl:right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
