"use client";
import { useState } from "react";
import { AnimatedNumber as AnimatedNumberFunction } from "@/components/chegall/radient/animated-number";
import { SectionIntroForDrawer } from "@/components/chegall/SectionIntroForDrawer";
import { SectionIntro } from "@/components/chegall/studio/SectionIntro";
import { Container } from "@/components/chegall/studio/Container";
import { Border } from "@/components/chegall/studio/Border";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
import { Button } from "@/components/chegall/studio/Button";
import { DrawerWrapper } from "@/components/chegall/DrawerWrapper";

export function Statistics() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  const maxValue = Math.max(...data.map((item) => item.value));
  return (
    <>
      {/* Chart Dialog */}

      <DrawerWrapper
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // title="خلاصه رشد سرمایه در پروژه کا"
      >
        <SectionIntroForDrawer
          eyebrow="سرمایه‌گذاری مطمئن"
          title="سرمایه‌گزاری مطمئن با ساختمان‌های مطمئن"
          invert="true"
        >
          <p>
            در گروه ساختمانی آتیار، ما به ارائه راهکارهای سرمایه‌گذاری مطمئن و
            قابل اعتماد برای مشتریانمان افتخار می‌کنیم. با تجربه و تخصص در صنعت
            ساخت و ساز، ما پروژه‌هایی را توسعه می‌دهیم که نه تنها ارزش مالی
            دارند، بلکه دارای پتانسیل رشد بلندمدت نیز هستند.
          </p>
        </SectionIntroForDrawer>
        <div className="lg:px-40 lg:py-20">
          <div className="mx-auto mt-16 w-full rounded-none bg-zinc-800 lg:w-9/12 lg:rounded-4xl">
            <div className="px-8 py-12 lg:px-20 lg:py-20">
              <h2 className="mb-16 max-w-xl text-4xl font-medium text-neutral-300 sm:text-5xl">
                سرمایه پروژه کا در مقابل دیگر بازارها
              </h2>

              {data.map((item, index) => (
                <div
                  dir="ltr"
                  key={index}
                  className={`flex gap-4 ${index === data.length - 1 ? `` : `mb-6`}`}
                >
                  <div className="flex basis-10/12 flex-col gap-2">
                    {/* Bar */}

                    <div
                      className={`h-[0.45rem] lg:h-3 ${item.color} rounded-xl`}
                      style={{
                        width: `${(item.value / maxValue) * 100}%`,
                      }}
                    ></div>

                    {/* Label */}
                    <div className="text-sm font-medium text-neutral-300">
                      {item.label}
                    </div>
                  </div>

                  {/* Value */}
                  <div
                    className={`basis-2/12 text-end text-2xl font-bold text-neutral-300`}
                  >
                    {item.value === 1
                      ? ""
                      : `x${englishToPersianDigits(item.value)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SectionIntroForDrawer
          eyebrow="سرمایه‌گذاری مطمئن"
          title="سرمایه‌گزاری مطمئن با ساختمان‌های مطمئن"
          invert="true"
          className="mt-16"
        >
          <p>
            در گروه ساختمانی آتیار، ما به ارائه راهکارهای سرمایه‌گذاری مطمئن و
            قابل اعتماد برای مشتریانمان افتخار می‌کنیم. با تجربه و تخصص در صنعت
            ساخت و ساز، ما پروژه‌هایی را توسعه می‌دهیم که نه تنها ارزش مالی
            دارند، بلکه دارای پتانسیل رشد بلندمدت نیز هستند.
          </p>
        </SectionIntroForDrawer>
      </DrawerWrapper>

      <SectionIntro
        eyebrow="سرمایه‌گذاری مطمئن"
        title="سرمایه‌گزاری مطمئن با ساختمان‌های مطمئن"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          در گروه ساختمانی آتیار، ما به ارائه راهکارهای سرمایه‌گذاری مطمئن و
          قابل اعتماد برای مشتریانمان افتخار می‌کنیم. با تجربه و تخصص در صنعت
          ساخت و ساز، ما پروژه‌هایی را توسعه می‌دهیم که نه تنها ارزش مالی دارند،
          بلکه دارای پتانسیل رشد بلندمدت نیز هستند.
        </p>
      </SectionIntro>
      <Container>
        <div className="mt-24 rounded-4xl bg-neutral-950 py-10 lg:mt-16 lg:py-15">
          <Container>
            <FadeIn className="flex items-center gap-x-8 pb-8">
              <h2 className="font-display text-center text-sm font-semibold tracking-wider text-white sm:text-left">
                سرمایه‌گذاری در مجموعه کا
              </h2>
            </FadeIn>
            <FadeInStagger>
              <dl className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
                <Border
                  as={FadeIn}
                  invert="true"
                  position="right"
                  className="flex flex-col-reverse pr-8"
                >
                  <dt className="mt-2 text-base text-neutral-200">
                    نسبت به بازار بورس
                  </dt>
                  <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                    x<AnimatedNumberFunction start={0} end={5} />
                  </dd>
                </Border>
                <Border
                  as={FadeIn}
                  invert="true"
                  position="right"
                  className="flex flex-col-reverse pr-8"
                >
                  <dt className="mt-2 text-base text-neutral-200">
                    نسبت به بازار طلا
                  </dt>
                  <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                    %<AnimatedNumberFunction start={0} end={30} />
                  </dd>
                </Border>
                <Border
                  as={FadeIn}
                  invert="true"
                  position="right"
                  className="flex flex-col-reverse pr-8"
                >
                  <dt className="mt-2 text-base text-neutral-200">
                    نسبت به میانگین بازار دلار
                  </dt>
                  <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                    <AnimatedNumberFunction start={15} end={30} />
                  </dd>
                </Border>
                <Border
                  as={FadeIn}
                  invert="true"
                  position="right"
                  className="flex flex-col-reverse pr-8"
                >
                  <dt className="mt-2 text-base text-neutral-200">
                    نسبت رشد میانگین بازار خودرو
                  </dt>
                  <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                    <AnimatedNumberFunction start={15} end={30} />
                  </dd>
                </Border>
              </dl>
            </FadeInStagger>
          </Container>
          <div className="mt-16 flex items-center justify-center lg:ml-16 lg:justify-end">
            <Button
              invert="true"
              outline="true"
              onClick={() => setIsDialogOpen(true)}
              aria-label={`Read more about our work: Jaroun Apartment Complex`}
            >
              اطلاعات بیشتر
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
