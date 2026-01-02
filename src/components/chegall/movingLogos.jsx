import { Marquee } from "@/components/ui/magicui/marquee";
import JarounLogo from "@/public/logos/jaroun/logomark-dark.svg";
import GerehLogo from "@/public/logos/gereh/logo.svg";
import KaLogo from "@/public/logos/ka/logo-dark.svg";
import ImazhLogo from "@/public/logos/imazh/imazh-logo.svg";
import IganLogo from "@/public/logos/igan/igan-logo.svg";
import BaharestanLogo from "@/public/logos/baharestan/baharestan-logo.svg";
import NirvanaLogo from "@/public/logos/nirvana/nirvana-dark.svg";
import GolkhaneLogo from "@/public/logos/golkhaneh/logo.svg";
import AnahitaLogo from "@/public/logos/anahita/anahita-dark.svg";
import DeyLogo from "@/public/logos/dey/dey-logo-3.svg";
const projectList = [
  {
    name: "ساختمان دی",
    href: "/work/dey",
    slug: "dey",
    icon: (
      <DeyLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },
  {
    name: "ساختمان نیروانا",
    href: "/work/nirvana",
    slug: "nirvana",
    icon: (
      <NirvanaLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },
  {
    name: "ویلای گلخانه",
    href: "/work/gollhane",
    slug: "golkhane",
    icon: (
      <GolkhaneLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },

  {
    name: "ساختمان آناهیتا",
    href: "/work/anahita",
    slug: "anahita",
    icon: (
      <AnahitaLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },

  {
    name: "ساختمان بهارستان",
    href: "/work/baharestan",
    slug: "baharestan",
    icon: (
      <BaharestanLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },

  {
    name: "ایگان مارکت",
    href: "/work/igan",
    slug: "igan",
    icon: (
      <IganLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },

  {
    name: "ساختمان ایماژ",
    href: "/work/imazh",
    slug: "imazh",

    icon: (
      <ImazhLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },
  {
    name: "ساختمان کا",
    href: "/work/ka",
    slug: "ka",
    icon: (
      <KaLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },

  {
    name: "ساختمان گره",
    href: "/work/gereh",
    slug: "gereh",

    icon: (
      <GerehLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },
  {
    name: "ساختمان جرون",
    href: "/work/jaroun",
    slug: "jaroun",

    icon: (
      <JarounLogo
        className="h-12 w-12 fill-white text-white/50"
        width={20}
        height={20}
      />
    ),
  },
];

export function ProjectCard({ name, href, icon }) {
  return (
    <figure
      className={cn(
        "relative h-full w-40 cursor-pointer overflow-hidden p-4 hover:rounded-[40px] hover:border",
        // light styles
        "border-gray-500/[.1] bg-gray-500/[.01] hover:bg-gray-500/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <a
        href={href}
        className="flex flex-col items-center justify-center gap-2"
      >
        {icon}
        <div className="flex flex-col">
          <figcaption className="text-center text-sm font-medium text-white">
            {name}
          </figcaption>
          {/* <p className="text-xs text-center font-medium dark:text-white/40">{username}</p> */}
        </div>
      </a>
      {/* <blockquote className="mt-2 text-sm">{body}</blockquote> */}
    </figure>
  );
}

export function MovingProjectLogos() {
  return (
    <div className="bg-appleTextBlack relative mx-auto flex w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-[40px] sm:max-w-lg sm:p-2">
      <Marquee pauseOnHover className="[--duration:20s]">
        {projectList.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </Marquee>
    </div>
  );
}
