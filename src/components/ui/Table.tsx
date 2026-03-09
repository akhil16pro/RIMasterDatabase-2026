import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { isMobile } from "react-device-detect";
import { DefaultButton } from "@/components/ui/buttons";
import { ToggleButton } from "@/components/ui/ToggleButton";

interface TableProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  tableHead: any[];
  tableData: any[];
}

export const Table = ({
  tableHead,
  tableData,
  className = "",
  ...rest
}: TableProps) => {
  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
      className={cn("flex-1 w-full overflow-hidden", className)}
    >
      <table
        className={cn(
          "w-full text-[var(--textColor)] border-separate border-spacing-y-2",
          isMobile ? "flex flex-col" : "table",
        )}
      >
        <thead className={cn(isMobile && "hidden")}>
          <tr className="bg-[linear-gradient(100deg,#FFC99D_-20%,#022EE4_120%)] text-white">
            {tableHead.map((head, index) => (
              <th
                key={`th-${index}`}
                className={cn(
                  "px-4 py-4 font-medium text-lg text-start ltr:first:rounded-l-lg ltr:last:rounded-r-lg rtl:first:rounded-r-lg rtl:last:rounded-l-lg",
                  head.key === "no" && "w-[3rem]",
                  head.key === "title" && "w-[20%]",
                  head.key === "action" && "w-[10rem]",
                  head.key === "status" && "w-[6rem]",
                )}
              >
                {head.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={cn(isMobile ? "flex flex-col gap-4" : "table-row-group")}
        >
          {tableData.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={cn(
                "group transition-all duration-300 bg-[linear-gradient(240deg,rgba(2,46,228,0.1)_0%,rgba(3,203,255,0.1)_100%)]",
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
                    (rowIndex + 1).toString().padStart(2, "0")
                  ) : head.key === "status" ? (
                    <div className="inline-flex">
                      <ToggleButton status={row[head.key || "status"]} />
                    </div>
                  ) : head.key === "action" ? (
                    <div className="flex gap-2">
                      {row.actions?.map((action: any, aIndex: number) => (
                        <DefaultButton
                          key={`action-${rowIndex}-${aIndex}`}
                          icon={action.icon}
                          onClick={action.onClick}
                          rounded={true}
                          iconGradient={action.type}
                          toolTip={action.toolTip}
                          toolTipClass={action.toolTipClass}
                        />
                      ))}
                    </div>
                  ) : head.key === "title" ? (
                    <span className="font-semibold text-lg">
                      {row[head.key]}
                    </span>
                  ) : (
                    row[head.key] || ""
                  )}
                </TD>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

function TD({ children, className, "data-label": dataLabel }: any) {
  return (
    <td
      data-label={dataLabel}
      className={cn(
        "px-4 py-4 text-base font-secondary",
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
