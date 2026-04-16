import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";

const AvatarContext = React.createContext<{ size?: "sm" | "lg" }>({});

interface AvatarImageProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
> {
  isloading?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, size = "sm", ...props }, ref) => (
  <AvatarContext.Provider value={{ size }}>
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex bg-muted shrink-0 overflow-hidden rounded-full",
        size === "sm" &&
          "rounded-[5px] md:rounded-lg size-8 md:size-10 lg:size-11 text-[1.1rem]",

        size === "lg" && "rounded-xl w-full h-auto aspect-square text-[1.5rem]",
        className,
      )}
      {...props}
    />
  </AvatarContext.Provider>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(AvatarContext);

  return (
    <>
      {props.isloading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted ">
          <RefreshCw
            className="size-9 animate-spin text-muted-foreground"
            strokeWidth={1}
            stroke="url(#dashboard_linear)"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <AvatarPrimitive.Image
            ref={ref}
            className={cn(
              "aspect-square h-full w-full object-cover ",
              size === "sm" && "rounded-[5px] md:rounded-lg",
              size === "lg" && "rounded-xl",

              className,
            )}
            {...props}
          />
        </motion.div>
      )}
    </>
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center  text-primary",

      className,
    )}
    {...props}
  >
    <i className="not-italic bg-[linear-gradient(270deg,#022EE4_0%,#03CBFF_100%)] bg-clip-text text-transparent">
      {children}
    </i>
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
