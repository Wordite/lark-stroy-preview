'use client'

import { useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import { formatPhone } from './formatPhone'

const isDigit = (c: string | undefined): boolean => c !== undefined && c >= '0' && c <= '9'

// Returns the index in `formatted` right after the n-th digit. If there are
// fewer than n digits, returns the end of the string.
const cursorAfterNDigits = (formatted: string, n: number): number => {
  if (n <= 0) return 0
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (isDigit(formatted[i])) {
      count++
      if (count === n) return i + 1
    }
  }
  return formatted.length
}

interface IUsePhoneInputArgs {
  value: string
  onChange: (next: string) => void
}

interface IUsePhoneInputReturn {
  value: string
  ref: (el: HTMLInputElement | null) => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

// Smart phone-input controller: keeps the formatted display in sync with a
// digit-only source of truth, restores cursor position after re-formatting,
// and intercepts Backspace on separator chars (`)`, ` `, `-`) so they delete
// the previous digit instead of getting stuck.
export const usePhoneInput = ({ value, onChange }: IUsePhoneInputArgs): IUsePhoneInputReturn => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cursorRef = useRef<number | null>(null)

  // Restore cursor position after React commits the new value.
  useLayoutEffect(() => {
    if (cursorRef.current !== null && inputRef.current) {
      const pos = Math.max(0, Math.min(cursorRef.current, inputRef.current.value.length))
      inputRef.current.setSelectionRange(pos, pos)
      cursorRef.current = null
    }
  }, [value])

  const setRef = (el: HTMLInputElement | null) => {
    inputRef.current = el
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const cursorIdx = e.target.selectionStart ?? raw.length
    const rawDigits = raw.replace(/\D/g, '')

    // No digits in the new raw value: either the user typed `+` into an empty
    // field, or backspace stripped everything down to a stray separator.
    if (raw && !rawDigits) {
      // Only surface the `+7 (` prefix when the user is typing into an empty
      // field. If the previous value was non-empty, this is a deletion path —
      // clear the field so the next backspace empties the input cleanly.
      if (raw.includes('+') && !value) {
        const out = '+7 ('
        cursorRef.current = out.length
        onChange(out)
        return
      }
      cursorRef.current = 0
      onChange('')
      return
    }

    const digitsBeforeCursor = raw.slice(0, cursorIdx).replace(/\D/g, '').length
    const formatted = formatPhone(raw)

    // formatPhone prepends 7 when the first typed digit isn't 7/8, so the
    // formatted string has one extra leading digit. Shift the cursor target
    // by +1 to compensate.
    const firstDigit = rawDigits[0]
    const shift = firstDigit && firstDigit !== '7' && firstDigit !== '8' ? 1 : 0

    // Only the leading 7 is present (no tail digits typed yet) — drop the
    // cursor at the end of the formatted prefix so the next digit lands
    // inside the parens.
    if (rawDigits.length + shift <= 1) {
      cursorRef.current = formatted.length
    } else {
      cursorRef.current = cursorAfterNDigits(formatted, digitsBeforeCursor + shift)
    }
    onChange(formatted)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace') return
    const input = e.currentTarget
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0

    // Range deletion — let the browser do its thing, our onChange will reformat.
    if (start !== end || start === 0) return

    const prevChar = value[start - 1]
    // If the previous char is already a digit, the browser's default backspace
    // works correctly and onChange will pick up the new value.
    if (isDigit(prevChar)) return

    // We're sitting on a separator (`)`, ` `, `-`) — jump back to the closest
    // digit and remove it instead of getting stuck.
    e.preventDefault()

    let digitPos = start - 1
    while (digitPos >= 0 && !isDigit(value[digitPos])) digitPos--
    if (digitPos < 0) return

    // Convert that position into a digit-array index.
    let digitIndex = -1
    let counter = -1
    for (let i = 0; i <= digitPos; i++) {
      if (isDigit(value[i])) {
        counter++
        if (i === digitPos) {
          digitIndex = counter
          break
        }
      }
    }
    if (digitIndex < 0) return

    const allDigits = value.replace(/\D/g, '')
    const newDigits = allDigits.slice(0, digitIndex) + allDigits.slice(digitIndex + 1)

    // Nothing left except the leading 7 → fully clear the field.
    const formatted = newDigits.length > 1 ? formatPhone(newDigits) : ''

    cursorRef.current = cursorAfterNDigits(formatted, digitIndex)
    onChange(formatted)
  }

  return { value, ref: setRef, onChange: handleChange, onKeyDown: handleKeyDown }
}
