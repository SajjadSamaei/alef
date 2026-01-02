// import LoginMoreInfo from "@/components/management/login/login-more-info";
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main dir="rtl" className="flex min-h-dvh flex-col bg-neutral-950 p-2">
      <div className="relative flex grow items-center justify-center rounded-[40px] bg-white p-6 ring-1 ring-zinc-950/5 lg:p-10 lg:shadow-xs dark:bg-zinc-900 dark:ring-white/10">
        {/* <LoginMoreInfo className="absolute top-1 left-4 md:left-10" /> */}
        {children}
      </div>
    </main>
  );
}
