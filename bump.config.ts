import process from 'node:process'
import { defineConfig } from 'bumpp'

export default defineConfig({
  preid: 'beta',
  commit: 'release: v%s',
  tag: 'v%s',
  push: true,
  customVersion: async (currentVersion, semver) => {
    const readline = await import('node:readline')

    const prereleaseTypes = ['alpha', 'beta', 'rc', 'next']
    const releaseTypes = ['patch', 'minor', 'major']

    const parsed = semver.parse(currentVersion)
    const currentPrerelease = parsed?.prerelease?.[0] as string | undefined

    const choices: { title: string, value: string | null }[] = []

    // 如果当前是预发布版本，添加升级到正式版的选项
    if (currentPrerelease && prereleaseTypes.includes(currentPrerelease)) {
      const releaseVersion = `${parsed!.major}.${parsed!.minor}.${parsed!.patch}`
      choices.push({
        title: `release (${releaseVersion})`,
        value: releaseVersion,
      })
    }

    choices.push(
      ...releaseTypes.map(type => ({
        title: `${type} (${semver.inc(currentVersion, type as any)})`,
        value: semver.inc(currentVersion, type as any),
      })),
      ...prereleaseTypes.map(type => ({
        title: `prerelease-${type} (${semver.inc(currentVersion, 'prerelease', type)})`,
        value: semver.inc(currentVersion, 'prerelease', type),
      })),
      ...prereleaseTypes.map(type => ({
        title: `prepatch-${type} (${semver.inc(currentVersion, 'prepatch', type)})`,
        value: semver.inc(currentVersion, 'prepatch', type),
      })),
      ...prereleaseTypes.map(type => ({
        title: `preminor-${type} (${semver.inc(currentVersion, 'preminor', type)})`,
        value: semver.inc(currentVersion, 'preminor', type),
      })),
      ...prereleaseTypes.map(type => ({
        title: `premajor-${type} (${semver.inc(currentVersion, 'premajor', type)})`,
        value: semver.inc(currentVersion, 'premajor', type),
      })),
    )

    console.log('\nSelect release type:')
    choices.forEach((choice, index) => {
      console.log(`  ${index + 1}. ${choice.title}`)
    })

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise<string>((resolve) => {
      rl.question('\nEnter number: ', (answer) => {
        rl.close()
        const index = Number.parseInt(answer, 10) - 1
        if (index >= 0 && index < choices.length && choices[index].value) {
          resolve(choices[index].value!)
        }
        else {
          console.log('Invalid selection, using default patch release')
          resolve(semver.inc(currentVersion, 'patch')!)
        }
      })
    })
  },
})
