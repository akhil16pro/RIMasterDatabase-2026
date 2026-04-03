import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
function ThankYouPopup({
  className,
  open,
  setOpen,
  description,
  title,
  type = "success",
  ...props
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  description: string;
  title: string;
  type: "success" | "error" | "warning" | "info";
}) {
  const { t } = useTranslation();

  // const bgColor =
  //   type === "success"
  //     ? "var(--color-primary)"
  //     : type === "error"
  //       ? "var(--color-danger)"
  //       : type === "warning"
  //         ? "var(--color-warning)"
  //         : "var(--color-info)";
  const bgColor =
    type === "success"
      ? "bg-[linear-gradient(180deg,#FFC99D_0%,var(--color-primary)_100%)]"
      : type === "error"
        ? "bg-[linear-gradient(180deg,#FFC99D_0%,var(--color-danger)_100%)]"
        : type === "warning"
          ? "bg-[linear-gradient(180deg,#FFC99D_0%,var(--color-warning)_100%)]"
          : "bg-[linear-gradient(180deg,#FFC99D_0%,var(--color-secondary)_100%)]";
  if (!title) {
    switch (type) {
      case "success":
        title = t("success");
        break;
      case "error":
        title = t("error");
        break;
      case "warning":
        title = t("warning");
        break;
      case "info":
        title = t("info");
        break;
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "lg:max-w-2xl py-15 md:py-18 flex flex-col items-center justify-center",
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="size-18 md:size-[6rem]  flex items-center justify-center relative"
          >
            {/* <svg
              width="131"
              height="131"
              viewBox="0 0 131 131"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin  animation-duration-[5000ms] absolute w-full h-full z-[-1]"
            >
              <path
                d="M124.039 49.8266C122.02 47.8108 120.415 45.4185 119.316 42.785C118.222 40.1494 117.661 37.3232 117.665 34.4696C117.665 28.4575 115.23 23.0369 111.304 19.0961C109.286 17.0764 106.889 15.4749 104.251 14.3834C101.613 13.2919 98.7856 12.7318 95.9306 12.7353C93.0772 12.7364 90.2517 12.1738 87.6163 11.0798C84.9809 9.98592 82.5875 8.38222 80.5736 6.36082C78.5567 4.33981 76.1602 2.73743 73.5218 1.64582C70.8835 0.554201 68.0554 -0.00511216 65.2001 3.52074e-05C62.3449 -0.00511216 59.5168 0.554201 56.8784 1.64582C54.2401 2.73743 51.8436 4.33981 49.8266 6.36082C47.7841 8.4033 45.393 9.9983 42.785 11.0827C40.177 12.1671 37.3521 12.7353 34.4696 12.7353C28.4575 12.7353 23.0369 15.1704 19.0961 19.0961C17.0764 21.114 15.4749 23.5108 14.3834 26.1489C13.2919 28.787 12.7318 31.6146 12.7353 34.4696C12.7353 37.3521 12.1712 40.1784 11.084 42.7864C9.9852 45.4198 8.3805 47.8122 6.36082 49.828C4.33997 51.8448 2.73769 54.2411 1.64608 56.8792C0.554468 59.5173 -0.00493359 62.3451 3.27804e-05 65.2001C3.27804e-05 70.7634 2.11526 76.3281 6.36082 80.5736C8.3805 82.5894 9.9852 84.9818 11.084 87.6152C12.178 90.2509 12.7392 93.077 12.7353 95.9306C12.7353 101.943 15.1704 107.363 19.0961 111.304C21.114 113.324 23.5108 114.925 26.1489 116.017C28.787 117.108 31.6146 117.668 34.4696 117.665C37.3521 117.665 40.1784 118.229 42.7864 119.316C45.3944 120.403 47.7841 121.997 49.828 124.039C51.8448 126.06 54.2411 127.663 56.8792 128.754C59.5173 129.846 62.3451 130.405 65.2001 130.4C70.7634 130.4 76.3281 128.285 80.5736 124.039C82.6161 121.997 85.0072 120.402 87.6152 119.318C90.2232 118.233 93.0481 117.665 95.9306 117.665C101.943 117.665 107.363 115.23 111.304 111.304C113.324 109.286 114.925 106.889 116.017 104.251C117.108 101.613 117.668 98.7856 117.665 95.9306C117.665 93.0481 118.229 90.2219 119.316 87.6139C120.415 84.9804 122.02 82.588 124.039 80.5723C126.06 78.5555 127.663 76.1592 128.754 73.5211C129.846 70.883 130.405 68.0551 130.4 65.2001C130.4 59.6368 128.285 54.0722 124.039 49.8266Z"
                fill="url(#paint0_linear_306_1961)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_306_1961"
                  x1="269.354"
                  y1="-37.5996"
                  x2="144.351"
                  y2="-129.091"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color={bgColor} />
                  <stop offset="1" stop-color="#FFC99D" />
                </linearGradient>
              </defs>
            </svg> */}
            <div className="absolute w-[44px] h-[44px] z-[-1] scale-[1.5] md:scale-[2.3] animate-spin animation-duration-[5000ms]">
              <div
                className={cn("w-full h-full", bgColor, "shapeMorphing")}
              ></div>
            </div>

            {type === "success" && (
              <Check strokeWidth={3} className="size-8 md:size-10 text-white" />
            )}
            {type === "error" && (
              <X strokeWidth={3} className="size-8 md:size-10 text-white" />
            )}
            {type === "warning" && (
              <AlertTriangle
                strokeWidth={2}
                className="size-8 md:size-10 text-white"
              />
            )}
            {type === "info" && (
              <Info strokeWidth={2} className="size-8 md:size-10 text-white" />
            )}
          </motion.div>
        </div>

        <motion.DialogHeader
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-0"
        >
          <DialogTitle
            className={cn(
              "text-center font-medium",

              type === "error" && "text-[var(--color-danger)]",
            )}
          >
            {title}
          </DialogTitle>
        </motion.DialogHeader>

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <DialogDescription
              className="text-center max-w-[80%]  mx-auto text-xl md:text-2xl leading-[140%]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { ThankYouPopup };
