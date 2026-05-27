'use client'

import { useIsMobile } from './useMediaQuery'

/**
 * Returns `'_blank'` on desktop and `undefined` on mobile so that internal/content
 * links open in the same tab on phones (avoids tab bloat in mobile browsers).
 * Use only for non-social links; keep `_blank` explicit on social/external icons.
 */
export function useExternalTarget(): '_blank' | undefined {
  const isMobile = useIsMobile()
  return isMobile ? undefined : '_blank'
}
