import { cn } from "@/lib/utils";
export default function BarChart({ data }: { data: any[] }) {
  data = [
    {
      name: "Ministry of Health",
      value: 80,
    },
    {
      name: "Ministry of Health",
      value: 75,
    },
    {
      name: "Ministry of Health",
      value: 60,
    },
    {
      name: "Ministry of Health",
      value: 62,
      visibility: true,
    },
    {
      name: "Ministry of Health",
      value: 45,
    },
    {
      name: "Ministry of Health",
      value: 35,
    },
    {
      name: "Ministry of Health",
      value: 25,
    },
    {
      name: "Ministry of Health",
      value: 20,
    },
    {
      name: "Ministry of Health",
      value: 15,
    },
    {
      name: "Ministry of Health",
      value: 9,
    },
  ];
  return (
    <div className="barChart w-full h-full flex gap-4 ">
      {data.map((item, index) => (
        <div
          key={index}
          className={cn(
            "barItem flex flex-col items-center justify-end gap-2",
            !item.visibility && "lock blur-[5px]",
          )}
        >
          <div
            className="barValue bg-[linear-gradient(180deg,#FFC99D_0%,#022EE4_100%)] w-[10px] rounded-lg"
            style={{ height: item.value + "%" }}
          ></div>
          <span className="barLabel text-base text-[var(--textColor)] font-medium">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
