'use client'

import { useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'

interface UseMobileMenuAnimationResult {
  isOpen: boolean
  toggle: () => void
  close: () => void
  panelRef: React.RefObject<HTMLDivElement | null>
  itemsRef: React.RefObject<HTMLDivElement | null>
  expanded: Record<string, boolean>
  toggleExpanded: (key: string) => void
  registerSubmenu: (key: string, el: HTMLDivElement | null) => void
}

export function useMobileMenuAnimation(): UseMobileMenuAnimationResult {
  const [isOpen, setIsOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const panelRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<HTMLDivElement | null>(null)
  const submenusRef = useRef<Record<string, HTMLDivElement | null>>({})

  const toggle = () => setIsOpen((v) => !v)
  const close = () => setIsOpen(false)

  const registerSubmenu = (key: string, el: HTMLDivElement | null) => {
    submenusRef.current[key] = el
  }

  const toggleExpanded = (key: string) => {
    const el = submenusRef.current[key]
    const willOpen = !expanded[key]
    setExpanded((s) => ({ ...s, [key]: willOpen }))
    if (!el) return
    if (willOpen) {
      gsap.set(el, { height: 'auto', opacity: 1 })
      const h = el.offsetHeight
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.45, ease: 'power3.out', onComplete: () => gsap.set(el, { height: 'auto' }) },
      )
      const children = el.querySelectorAll('a')
      gsap.fromTo(
        children,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.1 },
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.inOut' })
    }
  }

  // Open / close panel animation.
  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current
    const items = itemsRef.current
    if (!panel) return

    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      gsap.set(panel, { display: 'flex' })
      gsap.fromTo(
        panel,
        { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.6 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.55, ease: 'power3.out' },
      )
      if (items) {
        const children = items.querySelectorAll(':scope > *')
        gsap.fromTo(
          children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 },
        )
      }
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      gsap.to(panel, {
        clipPath: 'inset(0% 0% 100% 0%)',
        opacity: 0.6,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          if (panel) panel.style.display = 'none'
        },
      })
    }

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isOpen])

  return { isOpen, toggle, close, panelRef, itemsRef, expanded, toggleExpanded, registerSubmenu }
}
