import { cn } from "@/lib/utils";

function SectionTitle({
  className,
  type,
  size,
  gradient,
  ...props
}: React.ComponentProps<"h2"> & {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "small" | "large";
  gradient?: boolean;
}) {
  let Tag = "h2";
  if (type && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)) {
    Tag = type;
  }
  if (!size) {
    size = "large";
  }
  return (
    <Tag
      className={cn(
        "font-bold  text-[var(--textColor)] ",
        size === "small" &&
          "lg:text-[1.6rem]  2xl:text-[1.8rem] md:text-[1.7rem] text-[1.4rem] leading-[100%]",
        size === "large" &&
          "lg:text-[2.2rem] xl:text-[2.3rem] 2xl:text-[2.5rem] text-[2rem] leading-[100%]",
        gradient &&
          "bg-[linear-gradient(270deg,#022EE4_0%,#FFC99D_100%)] bg-clip-text text-transparent",
        className,
      )}
      {...props}
    >
      {props.children}
    </Tag>
  );
}

export { SectionTitle };
