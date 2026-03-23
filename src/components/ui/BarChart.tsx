import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";

export default function BarChart({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) {
  const isMobile = useMobile();
  const [maxLabelHeight, setMaxLabelHeight] = useState(0);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const gridValues = Array.from({ length: 11 }, (_, i) => 100 - i * 10);

  useLayoutEffect(() => {
    if (labelRefs.current.length === 0) return;

    const handleResize = () => {
      const heights = labelRefs.current
        .filter((el): el is HTMLSpanElement => el !== null)
        .map((el) => el.getBoundingClientRect().height);

      if (heights.length > 0) {
        setMaxLabelHeight(Math.max(...heights));
      }
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        handleResize();
      });
    });

    labelRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [data]);

  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const checkMobile = () => setIsMobile(window.innerWidth < 768);
  //   checkMobile();
  //   window.addEventListener("resize", checkMobile);
  //   return () => window.removeEventListener("resize", checkMobile);
  // }, []);

  return (
    <div className="barChart w-full h-full grid grid-flow-row md:grid-flow-col  gap-4 relative ps-0 md:ps-10">
      {!isMobile && (
        <div
          className="bgLayer absolute left-0 top-0 w-full z-0  flex flex-col justify-between pointer-events-none "
          style={{
            height:
              maxLabelHeight > 0
                ? `calc(100% - 10px - ${maxLabelHeight}px)`
                : "calc(100% - 10px - 30px)",
          }}
        >
          {gridValues.map((val, index) => (
            <div
              key={`bglayer-${val}`}
              className={cn("bgItem flex items-end gap-2 w-full")}
            >
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className={cn(
                  "num w-6 text-right text-[var(--textColor)] text-sm font-medium opacity-70 leading-[100%] translate-y-[50%]",
                  val === 0 && "opacity-0",
                )}
              >
                {val}
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={
                  isLoading
                    ? {
                        scaleX: [0, 1, 0],
                      }
                    : {
                        scaleX: 1,
                      }
                }
                transition={
                  isLoading
                    ? {
                        delay: index * 0.05,
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : {
                        delay: index * 0.05,
                        duration: 0.8,
                        ease: "easeInOut",
                      }
                }
                className="line flex-1 h-[1px] bg-[var(--textColor)] opacity-[.1] origin-left "
              ></motion.div>
            </div>
          ))}
        </div>
      )}

      {data?.map((item, index) => (
        <Bar
          item={item}
          index={index}
          maxLabelHeight={maxLabelHeight}
          labelRefs={labelRefs}
          key={`bar-${index}`}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

function Bar({ item, index, maxLabelHeight, labelRefs, isMobile }: any) {
  const userSession = useAtomValue(userSessionAtom);

  function generateRandomString(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  return (
    <div
      className={cn(
        "barItem z-10 grid grid-cols-[90px_1fr_auto] md:grid-cols-1 md:grid-rows-[1fr_auto] md:h-full md:items-end items-center gap-[5px] md:gap-[10px]",
        !item.visibility &&
          !userSession?.user?.roles?.includes("admin") &&
          "lock blur-[3px] pointer-events-none",
      )}
    >
      <div className="flex md:justify-center md:items-end items-center md:h-full order-2 md:order-1">
        {item.visibility || userSession?.user?.roles?.includes("admin") ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className="barValue bg-[linear-gradient(-90deg,#FFC99D_0%,#022EE4_100%)] md:bg-[linear-gradient(180deg,#FFC99D_0%,#022EE4_100%)]  rounded-lg cursor-pointer "
                  initial={
                    isMobile
                      ? { width: 0, height: "7px" }
                      : { height: 0, width: "10px" }
                  }
                  animate={
                    isMobile
                      ? { width: `${item.value}%` }
                      : { height: `${item.value}%` }
                  }
                  transition={{
                    delay: index * 0.1,
                    duration: 1,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </TooltipTrigger>

              <TooltipContent>{`${item.title} : ${item.value}`}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.div
            className="barValue bg-[linear-gradient(-90deg,#FFC99D_0%,#022EE4_100%)] md:bg-[linear-gradient(180deg,#FFC99D_0%,#022EE4_100%)]  rounded-lg "
            initial={
              isMobile
                ? { width: 0, height: "7px" }
                : { height: 0, width: "10px" }
            }
            animate={
              isMobile
                ? { width: `${item.percentage}%`, height: "7px" }
                : { height: `${item.percentage}%`, width: "10px" }
            }
            transition={{
              delay: index * 0.1,
              duration: 1,
              ease: "easeInOut",
            }}
          ></motion.div>
        )}
      </div>
      <div
        className="flex  md:justify-center md:text-center order-1 md:order-2 "
        style={{
          height:
            !isMobile && maxLabelHeight > 0 ? `${maxLabelHeight}px` : "auto",
        }}
      >
        <div
          className="flex flex-col gap-2 justify-center items-center"
          ref={(el) => (labelRefs.current[index] = el)}
        >
          {userSession?.user?.roles?.includes("admin") && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="flex bg-[linear-gradient(90deg,#FFC99D_0%,#022EE4_100%)] p-[1px] rounded-full max-w-[38px] md:max-w-[40px] lg:max-w-[45px] "
            >
              <div className="flex justify-center items-center bg-white rounded-full aspect-square overflow-hidden">
                <img
                  src={item?.image || "/entityPlaceholder.png"}
                  width={80}
                  height={80}
                  alt=" w-full h-auto"
                />
              </div>
            </motion.div>
          )}

          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="barLabel text-base text-[var(--textColor)] font-medium leading-[100%]"
          >
            {item.visibility || userSession?.user?.roles?.includes("admin")
              ? item.title
              : generateRandomString(15)}
          </motion.span>
        </div>
      </div>
      {isMobile && (
        <div
          className="flex  md:justify-center md:text-center order-3  "
          style={{
            height:
              !isMobile && maxLabelHeight > 0 ? `${maxLabelHeight}px` : "auto",
          }}
        >
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="barLabel text-base text-[var(--textColor)] font-medium leading-[100%]"
          >
            {`${item.percentage}%`}
          </motion.span>
        </div>
      )}
    </div>
  );
}
