export function isValidEmail(email: string) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

export function isMediumPassword(password: string) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
  return re.test(password)
}

export function isSamePassword(password: string, repassword: string) {
  return password === repassword
}

export function isValidURL(url: string) {
  const re = /^(ftp|http|https):\/\/[^ "]+$/
  return re.test(url)
}