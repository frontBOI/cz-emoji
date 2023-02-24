const findUp = require('find-up')
const fs = require('fs')
const homedir = require('homedir')
const truncate = require('cli-truncate')
const wrap = require('wrap-ansi')
const path = require('path')
const util = require('util')
const pad = require('pad')

const types = require('./lib/types')

const readFile = util.promisify(fs.readFile)

function loadConfig(filename) {
  return readFile(filename, 'utf8')
    .then(JSON.parse)
    .then(obj => obj && obj.config && obj.config['cz-frontboi'])
    .catch(() => null)
}

function loadConfigUpwards(filename) {
  return findUp(filename).then(loadConfig)
}

/**
 * Read the configuration extracted from either the package.json, .czrc or global .czrc files
 *
 * @param {Object} config the configuration object if it exists, or an empty object
 */
async function getConfig() {
  const defaultConfig = {
    types,
    symbol: false,
    skipQuestions: [''],
    subjectMaxLength: 75,
    format: '{emoji} {type}{scope}: {subject}'
  }

  const loadedConfig =
    (await loadConfigUpwards('package.json')) ||
    (await loadConfigUpwards('.czrc')) ||
    (await loadConfig(path.join(homedir(), '.czrc'))) ||
    {}

  const config = {
    ...defaultConfig,
    ...loadedConfig,
    types: loadedConfig.overrideTypes
      ? loadedConfig.types ?? []
      : [...defaultConfig.types, ...(loadedConfig.types ?? [])],
    scopes: loadedConfig.scopes
  }

  return config
}

function getEmojiChoices({ types, symbol }) {
  const maxNameLength = types.reduce(
    (maxLength, type) => (type.name.length > maxLength ? type.name.length : maxLength),
    0
  )

  return types.map(choice => ({
    name: `${pad(choice.name, maxNameLength)}  ${choice.emoji}  ${choice.description}`,
    value: {
      emoji: symbol ? `${choice.emoji} ` : choice.code,
      name: choice.name
    },
    code: choice.code
  }))
}

async function requiredField(input) {
  return input.length === 0 ? 'Il faut renseigner une valeur' : true
}

/**
 * Create inquier.js questions object trying to read `types` and `scopes` from the current project
 * `package.json` falling back to nice default :)
 *
 * @param {Object} config Result of the `getConfig` returned promise
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function createQuestions(config) {
  return [
    {
      type: 'list',
      name: 'type',
      choices: getEmojiChoices(config),
      message: config.questions && config.questions.type ? config.questions.type : 'Sélectionne le type de ton commit:'
    },
    {
      type: config.scopes ? 'list' : 'input',
      name: 'scope',
      message:
        config.questions && config.questions.scope ? config.questions.scope : 'Renseigne le scope de ton commit:',
      choices: config.scopes && config.scopes.map(scope => scope.name),
      when: !config.skipQuestions.includes('scope')
    },
    {
      type: 'maxlength-input',
      name: 'subject',
      message: config.questions && config.questions.subject ? config.questions.subject : 'Sujet de ton commit:',
      maxLength: config.subjectMaxLength,
      validate: requiredField
    },
    {
      type: 'input',
      name: 'body',
      message:
        config.questions && config.questions.body ? config.questions.body : 'Fournis une description pour ton commit:',
      when: !config.skipQuestions.includes('body'),
      validate: requiredField
    }
  ]
}

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provide by `inquier.js`
 * @param {Object} config Result of the `getConfig` returned promise
 * @return {String} Formatted git commit message
 */

function formatCommitMessage(answers, config) {
  const { columns } = process.stdout

  const emoji = config.types.find(type => type.code === answers.type.emoji).emoji
  const type = answers.type.name
  const scope = answers.scope
    ? config.scopes
      ? `(${config.scopes.find(scope => scope.name === answers.scope).value.trim()})`
      : `(${answers.scope})`
    : ''
  const subject = answers.subject.trim()

  const commitMessage = config.format
    .replace(/{emoji}/g, emoji)
    .replace(/{type}/g, type)
    .replace(/{scope}/g, scope)
    .replace(/{subject}/g, subject)
    // Only allow at most one whitespace.
    // When an optional field (ie. `scope`) is not specified, it can leave several consecutive
    // white spaces in the final message.
    .replace(/\s+/g, ' ')

  const head = truncate(commitMessage, columns)
  const body = wrap(answers.body || '', columns)

  return [head, body]
    .filter(Boolean)
    .join('\n\n')
    .trim()
}

/**
 * Interactively prompts the git commit message to the user.
 *
 * @param {commitizen} cz Commitizen object
 * @return {String} Git message provided by the user
 */
async function promptCommitMessage(cz) {
  cz.prompt.registerPrompt('maxlength-input', require('inquirer-maxlength-input-prompt'))

  console.log(`
  ┬  ┌─┐  ┌─┐┌─┐┌┬┐┌┬┐┬┌┬┐  ┌─┐┬─┐┌─┐┌─┐┬─┐┌─┐
  │  ├┤   │  │ ││││││││ │   ├─┘├┬┘│ │├─┘├┬┘├┤ 
  ┴─┘└─┘  └─┘└─┘┴ ┴┴ ┴┴ ┴   ┴  ┴└─└─┘┴  ┴└─└─┘ by frontBOI
  ⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜
  `)
  const config = await getConfig()
  const questions = createQuestions(config)
  const answers = await cz.prompt(questions)
  const message = formatCommitMessage(answers, config)

  return message
}

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
  prompter: (cz, commit) => {
    promptCommitMessage(cz).then(commit)
  }
}
