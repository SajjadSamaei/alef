import clsx from 'clsx'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/ui/FadeIn'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { useLocale } from 'next-intl'

export function PostIntro({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow: React.ReactNode
  title: string
  children: React.ReactNode
  centered?: boolean
}) {
  const locale = useLocale()
  const localizedTitle = locale === 'fa' ? digitsEnToFa(title) : title

  return (
    <Container className={clsx('mt-4 md:mt-0', centered && 'text-center')}>
      <FadeIn>
        <h1>
          <span className="eyebrow-style text-appleAirGray text-base dark:text-neutral-300">
            {eyebrow}
          </span>
          <span className="sr-only"> - </span>
          <span
            className={clsx(
              'font-display mt-6 block max-w-5xl text-4xl font-medium text-balance text-neutral-950 dark:text-appleBackgroundWhite sm:text-6xl',
              centered && 'mx-auto',
              locale === 'fa' ? 'tracking-normal' : 'tracking-tight',
            )}
          >
            {localizedTitle}
          </span>
        </h1>
        <div className={clsx('mt-6 max-w-3xl text-xl', centered && 'mx-auto')}>{children}</div>
      </FadeIn>
    </Container>
  )
}
