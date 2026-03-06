import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "inputStyle  file:text-foreground placeholder:text-muted-foreground  h-10 w-full min-w-0   bg-transparent px-0 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  ",

          type === "password" && "pe-7",
          className,
        )}
        {...props}
      />
      {type === "password" && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-[50%] translate-y-[-50%] cursor-pointer"
        >
          {showPassword ? (
            <Eye className=" text-black/50 w-5 h-5" />
          ) : (
            <EyeOff className=" text-black/50 w-5 h-5" />
          )}
        </div>
      )}
    </div>
  );
}

export { Input };
