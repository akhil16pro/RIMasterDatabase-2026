import { Pencil, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function EditBadge({
  data,
  className,
}: {
  data: {
    user_info: {
      name: string;
      created_at: string;
    };
    modified_info: {
      name: string;
      updated_at: string;
    };
  };
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex gap-1 md:gap-2 flex-wrap w-full", className)}>
      {data?.user_info?.name && (
        <div className="flex gap-3 pe-3 items-center border border-primary rounded-md  overflow-hidden opacity-70 ">
          <div className="flex w-10 min-h-10  md:w-8 md:min-h-8 h-full items-center justify-center  bg-primary text-white ">
            <User size={17} strokeWidth={2} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 flex-wrap py-1 text-[1.1rem] md:text-base">
            <span className=" leading-none font-secondary whitespace-nowrap">
              {t("created_by")} :
            </span>
            <div className="flex gap-1 flex-wrap items-center ">
              <span className="font-medium leading-none font-secondary">
                {data.user_info?.name}
              </span>
              {data?.user_info?.created_at && (
                <small className="text-sm leading-none font-secondary opacity-60">
                  ({data?.user_info?.created_at})
                </small>
              )}
            </div>
          </div>
        </div>
      )}
      {data?.modified_info?.name && (
        <div className="flex gap-3 pe-3 items-center border border-success rounded-md  overflow-hidden opacity-70 ">
          <div className="flex w-10 min-h-10 md:w-8 md:min-h-8 h-full items-center justify-center  bg-success text-white ">
            <Pencil size={17} strokeWidth={2} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 flex-wrap py-1 text-[1.1rem] md:text-base">
            <span className=" leading-none font-secondary whitespace-nowrap">
              {t("last_edited_by")} :
            </span>
            <div className="flex gap-1 flex-wrap items-center ">
              <span className="font-medium leading-none font-secondary">
                {data.user_info?.name}
              </span>
              {data?.modified_info?.updated_at && (
                <small className=" text-sm leading-none font-secondary opacity-60">
                  ({data?.modified_info?.updated_at})
                </small>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
