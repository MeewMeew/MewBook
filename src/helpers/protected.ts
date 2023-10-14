export function protectEmail(email: string, char = '*') {
  const [name, domain] = email.split('@')
  const protectedEmail = `${name.slice(0, 3)}${char.repeat(name.length - 4)}@${domain}`
  return protectedEmail
}
