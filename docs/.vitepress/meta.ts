// noinspection ES6PreferShortImport: IntelliJ IDE hint to avoid warning to use `~/contributors`, will fail on build if changed

/* Texts */
export const destylerName = 'Destyler'
export const destylerShortName = 'Destyler'
export const destylerDescription = 'Unstyled component for Vue.js.'

/* CDN fonts and styles */
export const googleapis = 'https://fonts.googleapis.com'
export const gstatic = 'https://fonts.gstatic.com'
export const font = `${googleapis}/css2?family=Readex+Pro:wght@200;400;600&display=swap`

/* vitepress head */
export const ogUrl = 'https://vitest.dev/'
export const ogImage = `${ogUrl}og.png`

/* GitHub and social links */
export const github = 'https://github.com/destyler/destyler'
export const releases = 'https://github.com/destyler/destyler/releases'
export const contributing = 'https://github.com/destyler/destyler/blob/main/CONTRIBUTING.md'
export const discord = 'https://discord.gg/UGzqwWeaBS'
export const mastodon = 'https://elk.zone/mstdn.social/@elonehoo'
export const twitter = 'https://twitter.com/elonehoo'

/* Avatar/Image/Sponsors servers */
export const preconnectLinks = [googleapis, gstatic]
export const preconnectHomeLinks = [googleapis, gstatic]

/* PWA runtime caching urlPattern regular expressions */
export const pwaFontsRegex = new RegExp(`^${googleapis}/.*`, 'i')
export const pwaFontStylesRegex = new RegExp(`^${gstatic}/.*`, 'i')
// eslint-disable-next-line prefer-regex-literals
export const githubusercontentRegex = new RegExp('^https://((i.ibb.co)|((raw|user-images).githubusercontent.com))/.*', 'i')
