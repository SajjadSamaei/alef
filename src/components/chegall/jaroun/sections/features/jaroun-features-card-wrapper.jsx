import Image from "next/image";
import clsx from "clsx";

export const JarounFeatureCard = ({
  children,
  button = "true",
  position,
  imageSrc,
  imageAlt = "",
  width = "1000",
  height = "1000",
  bgColor = "bg-jarounGray1",
  titleColor = "text-jarounGray7",
  title,
  text,
  textColor = "text-jarounGray5",
}) => (
  <div className={clsx("relative", position)}>
    <div
      className={clsx(
        "max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] absolute inset-px rounded-3xl",
        bgColor,
      )}
    />
    <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
      <Image
        width={width}
        height={height}
        alt={imageAlt}
        src={imageSrc}
        className="h-80 object-cover"
      />
      <div className="p-10 pt-4">
        <p
          className={clsx(
            "mt-2 text-lg/7 font-medium tracking-tight",
            titleColor,
          )}
        >
          {title}
        </p>
        <p className={clsx("mt-2 mb-3 max-w-lg text-sm/6", textColor)}>
          {text}
        </p>
      </div>

      <div className={clsx(!button && "hidden", "absolute bottom-0 left-0")}>
        {children}
      </div>
    </div>

    <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
  </div>
);
