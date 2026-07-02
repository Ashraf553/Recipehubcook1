import { useMemo, type CSSProperties } from 'react';
import { getCategory } from '../data/categories';

/**
 * Returns an inline style that overrides --color-accent for everything
 * rendered inside the element it's applied to, tinting the page to match
 * the given recipe category.
 */
export function useAccentStyle(categorySlug?: string | null): CSSProperties {
  return useMemo(() => {
    if (!categorySlug) return {};
    const category = getCategory(categorySlug);
    if (!category) return {};
    return { '--color-accent': category.accent } as CSSProperties;
  }, [categorySlug]);
}
