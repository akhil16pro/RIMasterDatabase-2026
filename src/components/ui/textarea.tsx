import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "inputStyle border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive  flex field-sizing-content min-h-35 max-h-55 w-full  border-b bg-transparent  py-2 text-base  shadow-none outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  ",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
