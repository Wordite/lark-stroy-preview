// Formats raw input into +7 (XXX) XXX - XX - XX as the user types.
// Empty input → empty string. Leading 8/+7 normalised to 7.
export const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''

  let normalised = digits
  if (normalised.startsWith('8')) normalised = '7' + normalised.slice(1)
  else if (!normalised.startsWith('7')) normalised = '7' + normalised

  const tail = normalised.slice(1, 11)
  let out = '+7'
  if (tail.length === 0) return out + ' ('
  out += ' (' + tail.slice(0, 3)
  if (tail.length >= 3) out += ')'
  if (tail.length > 3) out += ' ' + tail.slice(3, 6)
  if (tail.length > 6) out += ' - ' + tail.slice(6, 8)
  if (tail.length > 8) out += ' - ' + tail.slice(8, 10)
  return out
}

export const countPhoneDigits = (value: string): number => value.replace(/\D/g, '').length
