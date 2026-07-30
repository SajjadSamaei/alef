import clsx from "clsx";
import { useLocale } from "next-intl";

export function Logomark({ invert = false, filled = false, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_2"
      data-name="Layer 2"
      viewBox="0 0 595.07 125.66"
      aria-hidden="true"
      {...props}
    >
      <g id="_0" data-name="0">
        <path
          id="LWPOLYLINE"
          d="M.35.35V125.3h594.37V78L30.99 51.77V25.88l134.03 6.36V.66L.35.35"
          className={invert ? "fill-white" : "fill-neutral-950"}
        />
        <path
          d="M190.79.45v33.13L594.68 52.4V.54L190.79.45Zm395.48 42.86L199.62 25.12V9l386.65-.04v34.35Z"
          className={invert ? "fill-white" : "fill-neutral-950"}
        />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  invert = false,
  filled = false,
  fillOnHover = false,
  isDark,
  ...props
}) {
  const locale = useLocale();
  return locale === "fa" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_2"
      data-name="Layer 2"
      viewBox="0 0 188.08 115.17"
      aria-hidden="true"
      className={clsx(fillOnHover && "group/logo", className)}
      {...props}
    >
      {/* <Logomark
        preserveAspectRatio="xMinYMid meet"
        invert={invert}
        filled={filled}
      /> */}
      <g id="_0" data-name="0">
        <path
          id="LWPOLYLINE"
          d="M24.02.39v71.06H.35v11.93H35.7V.39H24.02"
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
        />
        <path
          id="LWPOLYLINE-2"
          d="M43.46.39v82.99h144.26V34.31h-42.81v24.6h11.67V46.29h19.81v25.15H94.7v-37.1H63.02v12.08h20.49v24.72H55.07V.38H43.46"
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
        />
        <path
          id="LWPOLYLINE-3"
          d="M187.54 114.81h-12.19V102.7h-30.6V90.51h42.79v24.3"
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
        />
        <path
          id="LWPOLYLINE-4"
          d="M187.48 14.97v12.24H62.87v-12.3l124.61.06"
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
        />
        <path
          id="LWPOLYLINE-5"
          d="M187.51 12.36H137.5V.35h50.09v12.01"
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
        />
      </g>
    </svg>
  ) : (
    <svg
      id="Layer_2"
      data-name="Layer 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 5922.36 1501.78"
      className={clsx(fillOnHover && "group/logo", className)}
      {...props}
    >
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m3169.4,1163.54c-83.48-16.89-157.41-114.52-168.75-197.36-13.54-98.88-12.64-371.59-1.23-472.39,13.58-119.97,90.58-196.26,210.72-209.71,108.07-12.09,367.36-11.64,475.95-.05,116.56,12.44,178.1,73.95,209.8,183.56-19.84,266.39,29.5,577.11.86,838.04-4.47,40.72-26.91,101.42-54.19,131.68-10.35,11.47-96.13,64.47-102.18,64.47h-591.38v-230h516.6v-108.24c-143.06-20.03-363.1,26.93-496.21,0h.01Zm496.22-649.42h-435.03v419.41h435.03v-419.41h0Z"
        />
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m4719.22,284.12c54.42,9.11,169.94,98.08,169.94,155.59v723.83h-713.74c-45.83,0-169.94-112.69-169.94-155.59v-399.12h666.15v-94.71h-666.14v-230h713.73Zm-47.59,527.65h-448.63v121.77h448.63v-121.77Z"
        />
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m2890.71,838.83h-666.15v94.71h666.15v230h-727.32c-11.67,0-101.7-57.6-115.71-74.26-23.28-27.7-48.14-87.29-53.04-123.1-13.71-100.1-11.78-471.88,23.33-556.19,23.15-55.59,55.59-84.14,111.68-105.33,82.67-31.24,464.15-32.73,562.75-19.36,38.82,5.27,102.32,32.26,130.97,59.07,18.22,17.05,67.34,104.32,67.34,122.39v372.06h0Zm-231.11-324.71h-435.03v121.77h435.03v-121.77Z"
        />
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m1232.14,0v284.12h482.62c65.65,0,183.53,117.15,183.53,182.65v696.77h-231.11v-649.42h-435.03v649.42h-231.11V0h231.11-.01Z"
        />
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m892.27,284.12v230H226.12v419.41h666.15v230H178.54c-75.41,0-163.59-108.63-170.57-182.02-9.38-98.68-13.98-465.03,6.43-549.56,13.86-57.41,107.37-147.84,164.14-147.84h713.73,0Z"
        />
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m5745.63,0v933.54h176.73v230h-237.91c-45.83,0-169.94-112.69-169.94-155.59V0h231.12Z"
        />
        <path
          className={clsx(
            invert ? "fill-white" : "fill-neutral-950",
            isDark ? "fill-white" : "fill-neutral-950",
          )}
          d="m5229.02,0v933.54h176.73v230h-224.31c-79.72,0-183.53-132.35-183.53-209.71V0h231.11,0Z"
        />
      </g>
    </svg>
  );
}
