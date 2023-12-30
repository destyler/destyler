export function toggleTheme() {
  const colorMode = useColorMode()
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
