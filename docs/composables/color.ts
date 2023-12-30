export function toggleTheme() {
  const colorMode = useColorMode()
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}

export function isDark() {
  const colorMode = useColorMode()
  return colorMode.preference === 'dark'
}
