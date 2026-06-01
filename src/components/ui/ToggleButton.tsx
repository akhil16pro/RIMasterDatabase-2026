import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const ToggleButton = ({
  yesLable,
  noLable,
  className = "",
  status: initialStatus = false,
  onToggle,
  readonly,
}: {
  yesLable?: string;
  noLable?: string;
  className?: string;
  status: boolean;
  onToggle?: (newStatus: boolean) => void;
  readonly?: boolean;
}) => {
  const { t } = useTranslation();

  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const handleToggle = () => {
    const newStatus = !currentStatus;
    setCurrentStatus(newStatus);
    if (onToggle) onToggle(newStatus);
  };

  const displayYes = yesLable || t("on");
  const displayNo = noLable || t("off");

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex items-center p-[4px] rounded-[7px] gap-[2px] font-regular cursor-pointer group overflow-hidden relative text-white text-[.75rem] uppercase min-w-[70px] transition-all duration-500 leading-[130%]",
        currentStatus
          ? "bg-[linear-gradient(80deg,#022EE4_0%,#03CBFF_100%)]"
          : "bg-[linear-gradient(80deg,#FFC99D_0%,#F07067_100%)]",
        readonly && "pointer-events-none",
        className,
      )}
    >
      <span
        className={cn(
          "absolute h-[70%] w-[calc(50%-6px)] z-0 bg-white rounded-[4px] top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out shadow-sm",
          currentStatus
            ? "ltr:left-[calc(50%+2px)] rtl:right-[calc(50%+2px)]"
            : "ltr:left-[4px] rtl:right-[4px]",
        )}
      ></span>

      <span
        className={cn(
          "flex-1 z-10 transition-all duration-300",
          currentStatus ? " font-bold" : "opacity-50",
        )}
      >
        {displayYes}
      </span>
      <span
        className={cn(
          "flex-1 z-10 transition-all duration-300",
          !currentStatus ? " font-bold" : "opacity-50",
        )}
      >
        {displayNo}
      </span>
    </button>
  );
};
