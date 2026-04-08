import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

import { DefaultButton } from "@/components/ui/buttons";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useMobile } from "@/hooks/use-mobile";
import { PenLine, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface TableProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  tableHead: any[];
  tableData: any[];
  translator?: any;
  pageStartIndex?: number;
}

export const Table = ({
  tableHead,
  tableData,
  className = "",
  translator,
  onStatusToggle,
  pageStartIndex = 1,

  ...rest
}: TableProps) => {
  const isMobile = useMobile();
  const { t, i18n } = useTranslation();

  const [animationWait, setAnimationWait] = useState(true);

  return (
    <div {...rest} className={cn("flex-1 w-full overflow-hidden", className)}>
      <table
        className={cn(
          "w-full text-[var(--textColor)] border-separate border-spacing-y-2",
          isMobile ? "flex flex-col" : "table",
        )}
      >
        <motion.thead
          className={cn(isMobile && "hidden")}
          initial={{ opacity: 0, x: i18n.language === "ar" ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: i18n.language === "ar" ? 40 : -40 }}
          transition={{
            delay: 0,
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <tr className="bg-[linear-gradient(100deg,#FFC99D_-20%,#022EE4_120%)] text-white">
            {tableHead.map((head, index) => (
              <th
                key={`th-${index}`}
                className={cn(
                  "px-4 py-4 font-medium text-lg text-start ltr:first:rounded-l-lg ltr:last:rounded-r-lg rtl:first:rounded-r-lg rtl:last:rounded-l-lg",
                  head.key === "no" && "w-[3rem]",
                  head.key === "title" && "min-w-[20%]",
                  (head.key === "action" || head.key === "actions") &&
                    "w-[5rem]",
                  head.key === "status" && "w-[6rem]",
                )}
              >
                {head?.title}
              </th>
            ))}
          </tr>
        </motion.thead>
        <tbody
          className={cn(isMobile ? "flex flex-col gap-4" : "table-row-group")}
        >
          <AnimatePresence mode={animationWait ? "wait" : ""}>
            {tableData.map((row, rowIndex) => (
              <motion.tr
                key={row?.id || row?.slug || `row-${rowIndex}`}
                initial={{ opacity: 0, x: i18n.language === "ar" ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: i18n.language === "ar" ? 40 : -40 }}
                transition={{
                  delay: 0.05 * rowIndex + 0.05,
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className={cn(
                  "group bg-[linear-gradient(240deg,rgba(2,46,228,0.1)_0%,rgba(3,203,255,0.1)_100%)]",
                  isMobile ? "flex flex-col rounded-lg p-2" : "table-row",
                )}
              >
                {tableHead.map((head, colIndex) => (
                  <TD
                    key={`cell-${rowIndex}-${colIndex}`}
                    data-label={head.title}
                    className={cn(
                      !isMobile &&
                        colIndex === 0 &&
                        "ltr:rounded-l-lg rtl:rounded-r-lg",
                      !isMobile &&
                        colIndex === tableHead.length - 1 &&
                        "ltr:rounded-r-lg rtl:rounded-l-lg ",

                      head.key === "no" &&
                        "font-semibold text-lg bg-[linear-gradient(270deg,#022EE4_0%,#03CBFF_100%)] bg-clip-text text-transparent",
                    )}
                  >
                    {head.key === "no" ? (
                      (rowIndex + pageStartIndex).toString().padStart(2, "0")
                    ) : head.key === "status" ? (
                      <div className="inline-flex">
                        <ToggleButton
                          status={row[head.key || "status"]}
                          readonly={onStatusToggle === undefined ? true : false}
                          key={`toggle-${row.id}`}
                          onToggle={(value: boolean) => {
                            onStatusToggle(row?.slug, value);
                          }}
                        />
                      </div>
                    ) : head.key === "action" || head.key === "actions" ? (
                      // <div className="flex gap-2">
                      //   {row.actions?.map((action: any, aIndex: number) => (
                      //     <React.Fragment key={`action-${aIndex}-${row.id}`}>
                      //       {action.type === "view" && (
                      //         <ViewAction slug={row?.slug} />
                      //       )}
                      //       {action.type === "edit" && (
                      //         <EditAction slug={row?.slug} />
                      //       )}
                      //       {action.type === "delete" && (
                      //         <DeleteAction
                      //           slug={row?.slug}
                      //           setAnimationWait={setAnimationWait}
                      //         />
                      //       )}
                      //       {action.type === "view" && (
                      //         <ModificationAction slug={row?.slug} />
                      //       )}
                      //     </React.Fragment>
                      //   ))}
                      // </div>
                      <div className="flex gap-1 md:gap-2">
                        {row.actions?.map((action: any, aIndex: number) => {
                          const Component = action.render;

                          if (!Component) return null;

                          return (
                            <Component
                              key={`action-${rowIndex}-${aIndex}`}
                              slug={row?.slug}
                              {...(action.type === "delete"
                                ? { setAnimationWait }
                                : {})}
                            />
                          );
                        })}
                      </div>
                    ) : head.key === "title" ? (
                      <span className="font-semibold text-lg leading-[80%]">
                        {row[head.key]}
                      </span>
                    ) : (
                      row[head.key] || ""
                    )}
                  </TD>
                ))}
              </motion.tr>
            ))}

            {tableData.length === 0 && (
              <motion.tr
                key="empty-state-row"
                initial={{ opacity: 0, x: i18n.language === "ar" ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: i18n.language === "ar" ? 40 : -40 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "group  bg-[linear-gradient(240deg,rgba(2,46,228,0.1)_0%,rgba(3,203,255,0.1)_100%)]",
                  isMobile ? "flex flex-col rounded-lg p-2" : "table-row",
                )}
              >
                <td
                  colSpan={tableHead.length}
                  className={cn(
                    "px-4 py-4 text-base font-secondary text-center rounded-lg",
                  )}
                >
                  {t("no-data-available")}
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

function TD({ children, className, "data-label": dataLabel, ...props }: any) {
  const isMobile = useMobile();
  return (
    <td
      {...props}
      data-label={dataLabel}
      className={cn(
        "px-4 py-4 text-base font-secondary ",
        isMobile &&
          "py-3 grid grid-cols-[40%_1fr] [&:before]:content-[attr(data-label)] [&:before]:text-[var(--textColor)] [&:before]:font-medium [&:before]:opacity-40 border-b border-black/5 last:border-b-0 ",
        !isMobile && "table-cell",
        className,
      )}
    >
      <div>{children}</div>
    </td>
  );
}
