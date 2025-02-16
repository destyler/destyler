function camelCase(str) {
  return str.replace(/[-_]([a-z])/g, g => g[1].toUpperCase())
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function multiCapitalize(str) {
  return str.split('-').map(capitalize).join(' ')
}

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  plop.setHelper('camelize', camelCase)
  plop.setHelper('capitalize', capitalize)
  plop.setHelper('multiCapitalize', multiCapitalize)

  plop.setGenerator('machine', {
    description: 'Generates a new ui machine',
    prompts: [
      {
        type: 'input',
        name: 'machine',
        message: 'Enter machine name (e.g. menu, otp-input):',
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers)
        return actions

      const { machine } = answers

      actions.push({
        type: 'addMany',
        templateFiles: 'plop/component/**',
        destination: `packages/components/{{dashCase machine}}`,
        base: 'plop/component/',
        data: { machine, name: machine },
        abortOnFail: true,
      })

      return actions
    },
  })

  plop.setGenerator('examples', {
    description: 'Generates a new ui machine example',
    prompts: [
      {
        type: 'input',
        name: 'machine',
        message: 'Enter machine name (e.g. menu, otp-input):',
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers)
        return actions

      const { machine } = answers

      actions.push({
        type: 'addMany',
        templateFiles: 'plop/examples/**',
        destination: `examples`,
        base: 'plop/examples/',
        data: { machine, name: machine },
        abortOnFail: true,
      })

      actions.push({
        type: 'modify',
        path: 'shared/src/routers.ts',
        pattern: /= \[/,
        template: '= [\n  { path: "/{{machine}}", label: "{{multiCapitalize machine}}" },',
      })

      return actions
    },
  })
}
