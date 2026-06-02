import { Pencil, User } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useTranslation } from "react-i18next";

export default function EditBadge({
  data,

  className,
}: {
  data: {
    user_info: {};
  };
  className?: string;
}) {
  console.log(data, "badge data");
  //   const {t} = useTranslation()
  return (
    <div className={cn("flex gap-2 flex-wrap w-full", className)}>
      {data?.user_info?.name && (
        <div className="flex  items-center border border-primary rounded-md  overflow-hidden opacity-70 ">
          <div className="flex size-8 items-center justify-center  bg-primary text-white ">
            <User size={17} strokeWidth={2} />
          </div>
          <span className=" text-md font-secondary  px-3 ">
            {data.user_info?.name}
          </span>
        </div>
      )}
      {data?.user_info?.name && (
        <div className="flex  items-center border border-success rounded-md  overflow-hidden opacity-70 ">
          <div className="flex size-8 items-center justify-center  bg-success text-white ">
            <Pencil size={17} strokeWidth={2} />
          </div>
          <span className=" text-md font-secondary  px-3 ">
            {data?.user_info?.name}
          </span>
        </div>
      )}
    </div>
  );
}
