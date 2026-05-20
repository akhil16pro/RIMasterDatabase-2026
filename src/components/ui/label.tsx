import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  className,
  normalLabel = false,
  errorLabel = false,
  floating = false,
  error = false,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  normalLabel?: boolean;
  errorLabel?: boolean;
  floating?: boolean;
  error?: boolean;
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-black text-base leading-none font-light select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-[1.2rem] text-black/70",
        normalLabel && "font-secondary ",
        floating &&
          "absolute bottom-[-1px] ltr:right-0 rtl:left-0  translate-y-full",
        errorLabel &&
          " bg-[var(--brandRed)] text-[.85rem] inline-flex leading-[100%] px-2 py-[2px] rounded-[3px] font-secondary  text-white self-center [&:empty]:hidden",
        error === true &&
          "text-[var(--brandRed)] peer-focus:text-[var(--brandRed)] peer-placeholder-shown:text-[var(--brandRed)]",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
