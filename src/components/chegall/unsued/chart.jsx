import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
export const TestChart = () => {
  const data = [
    {
      label: "سرمایه‌گذاری در پروژه ساختمانی کا",
      value: 64.9,
      color: "bg-linear-to-r from-blue-500 to-pink-500",
    },
    {
      label: "سرمایه‌گذاری در بازار طلا",
      value: 55.5,
      color: "bg-gray-500",
    },
    {
      label: "سرمایه‌گذاری در بازار دلار",
      value: 18.9,
      color: "bg-gray-400",
    },
    {
      label: "ارزش فلان چیز",
      value: 1,
      color: "bg-gray-300",
    },
  ];

  // Find the maximum value
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div dir="ltr" className="mx-auto max-w-md">
      <h2 className="mb-4 text-xl font-bold text-neutral-950">
        رشد سرمایه در پروژه ساختمانی در برابر بازار‌های دیگر
      </h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-12 items-center">
            {/* Label */}
            <div className="col-span-5 text-sm font-medium text-neutral-950">
              {item.label}
            </div>
            {/* Bar */}
            <div className="relative col-span-6">
              <div
                className={`h-4 ${item.color} rounded-xs`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            {/* Value */}
            <div
              className={`col-span-1 text-right ${index === 0 ? "text-2xl" : "text-sm"} font-medium text-neutral-950`}
            >
              x{englishToPersianDigits(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
