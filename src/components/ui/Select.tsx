import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
  hasValue?: boolean;
  readOnly?: boolean;
  dir?: "ltr" | "rtl";
  onClear?: () => void;
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
      readOnly,
      onClear,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();
    const handleClear = (
      e: React.MouseEvent | React.PointerEvent | React.KeyboardEvent,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      onClear?.();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleClear(e);
      }
    };

    return (
      <div className="group relative flex w-full">
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "peer flex h-10 w-full items-center justify-between border-b border-black/20 bg-transparent py-1 text-[1.2rem] outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 text-black font-secondary font-light",
            "text-start",
            error && "border-[var(--brandRed)]",
            readOnly && "pointer-events-none",
            className,
          )}
          {...props}
          dir={dir}
        >
          <div className="truncate">{children}</div>

          {!readOnly && (
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </SelectPrimitive.Icon>
          )}
        </SelectPrimitive.Trigger>
        {!readOnly && hasValue && onClear && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all",
              "ltr:right-[18px] rtl:left-[18px]", // Position it just to the left of the Chevron
            )}
          >
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onMouseDown={(e) => e.stopPropagation()} // Stop Radix from focusing/opening
              className="hover:bg-black/5 rounded-full p-1 cursor-pointer outline-none pointer-events-auto"
              aria-label="Clear selection"
            >
              <X className="h-3 w-3 opacity-50 hover:opacity-100" />
            </span>
          </div>
        )}

        {label && (
          <label
            className={cn(
              "absolute transition-all pointer-events-none leading-[100%] font-secondary",
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
              "ltr:right-0 rtl:left-0",
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

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));

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
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-content-available-height)] max-h-[300px] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

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
SelectItem.displayName = SelectPrimitive.Item.displayName;
