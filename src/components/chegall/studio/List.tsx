import clsx from "clsx";
import { Border } from "@/components/chegall/studio/Border";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { Link } from "@/src/i18n/routing";

export function List({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeInStagger>
      <ul role="list" className={clsx("text-base text-neutral-600", className)}>
        {children}
      </ul>
    </FadeInStagger>
  );
}

export function ListItem({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <li className="group mt-10 first:mt-0">
      <FadeIn>
        <Border className="sub-paragraph-style pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden">
          {title && (
            <strong className="eyebrow-style font-semibold text-neutral-950">{`${title}. `}</strong>
          )}
          {children}
        </Border>
      </FadeIn>
    </li>
  );
}

export function ServiceItem({
  title,
  details,
  href,
  buttonText,
  children,
}: {
  children: React.ReactNode;
  title?: string;
  details?: string;
  href?: string;
  buttonText?: string;
}) {
  return (
    <li className="group mt-10 first:mt-0">
      <FadeIn>
        <Border
          position="simple"
          className="sub-paragraph-style pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {children}
            {title && (
              <strong className="subtitle-style mt-6 text-center font-bold text-neutral-950">{`${title}`}</strong>
            )}
            {details && (
              <p className="paragraph-style mt-2 max-w-lg text-center text-sm/6 text-gray-600">
                {details}
              </p>
            )}
            {href && (
              <div className="font-display mt-4 text-2xl font-semibold text-neutral-950">
                <Link href={href}>
                  {buttonText ? buttonText : "اطلاعات بیشتر"}
                </Link>
              </div>
            )}
          </div>
        </Border>
      </FadeIn>
    </li>
  );
}
