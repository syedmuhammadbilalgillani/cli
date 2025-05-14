'use client';

import { JSX } from 'react';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  textKey: string;
  ns?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements; // only allow valid HTML tags like 'div', 'span', etc.
}

export default function TranslatedText({
  textKey,
  ns,
  className,
  as = 'span',
}: TranslatedTextProps) {
  const { t } = useTranslation();
  const Component = as || 'span';

  return (
    <Component suppressHydrationWarning className={className}>
      {t(textKey)}
    </Component>
  );
}
