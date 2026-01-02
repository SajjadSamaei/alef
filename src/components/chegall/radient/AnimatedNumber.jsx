"use client";
import { AnimatedNumber as AnimatedNumberFunction } from "@/components/chegall/radient/animated-number";
import { SectionIntro } from "@/components/chegall/studio/SectionIntro";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";

export function AnimatedNumber() {
  return (
    <div className="max-lg:mt-16 lg:col-span-1">
      <SectionIntro
        eyebrow="اعداد"
        title="سرمایه‌گزاری مطمئن با ساختمان‌های مطمئن"
        className="mt-24 sm:mt-32 lg:mt-40"
      ></SectionIntro>
      <hr className="mt-6 border-t border-gray-800" />
      <Container className="mt-16">
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {/* <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]"> */}
          <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
            <dt className="text-sm/6 text-gray-600">Raised</dt>
            <dd className="order-first text-6xl font-medium tracking-tight text-gray-600">
              $<AnimatedNumberFunction start={100} end={150} />M
            </dd>
          </div>
          <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
            <dt className="text-sm/6 text-gray-600">Companies</dt>
            <dd className="order-first text-6xl font-medium tracking-tight text-gray-600">
              <AnimatedNumberFunction start={15} end={30} />K
            </dd>
          </div>
          <div className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4">
            <dt className="text-sm/6 text-gray-600">Deals Closed</dt>
            <dd className="order-first text-6xl font-medium tracking-tight text-gray-600">
              <AnimatedNumberFunction start={0.9} end={1.5} decimals={1} />M
            </dd>
          </div>
          <div className="flex flex-col gap-y-2">
            <dt className="text-sm/6 text-gray-600">Leads Generated</dt>
            <dd className="order-first text-6xl font-medium tracking-tight text-gray-600">
              <AnimatedNumberFunction start={150} end={200} />M
            </dd>
          </div>
          {/* </FadeIn> */}
        </dl>
      </Container>
    </div>
  );
}
