import { useTranslation } from '@/contexts/TranslationContext';

interface SkipLinkProps {
  targetId: string;
  children?: React.ReactNode;
}

export function SkipLink({ targetId, children }: SkipLinkProps) {
  const { t } = useTranslation();

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      onFocus={(e) => {
        // Ensure the target element can receive focus
        const target = document.getElementById(targetId);
        if (target && !target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
      }}
    >
      {children || t('common.skipToMain')}
    </a>
  );
}

export function SkipLinks() {
  const { t } = useTranslation();

  return (
    <>
      <SkipLink targetId="main-content">
        {t('common.skipToMain')}
      </SkipLink>
      <SkipLink targetId="main-navigation">
        {t('common.skipToNav')}
      </SkipLink>
    </>
  );
}