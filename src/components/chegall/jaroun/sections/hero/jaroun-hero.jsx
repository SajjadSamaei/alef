import {
  JarounHeroDesktop,
  JarounHeroMobile,
} from "@/components/chegall/jaroun/sections/hero/jaroun-hero-sections";
export default function JarounHero() {
  return (
    <div className="relative mt-4 md:mt-0">
      <JarounHeroMobile />
      <JarounHeroDesktop />
    </div>
  );
}
