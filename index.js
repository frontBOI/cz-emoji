const homedir = require('homedir')
const truncate = require('cli-truncate')
const path = require('path')
const pad = require('pad')

const types = require('./lib/types')
const { getCurrentBranchName, loadConfigUpwards, loadConfig, getBigTitle } = require('./utils')

/**
 * Lis la configuration extraite de package.json, .czrc (local ou global)
 * @returns {Object} config la configuration extraite, ou une configuration par défaut
 */
async function getConfig() {
  const defaultConfig = {
    types,
    symbol: false,
    skipQuestions: [''],
    descriptionMaxLength: 75,
    format: '{emoji} {type}{scope}: {description}'
  }

  const userConfig =
    (await loadConfigUpwards('package.json')) ||
    (await loadConfigUpwards('.czrc')) ||
    (await loadConfig(path.join(homedir(), '.czrc'))) ||
    {}

  const allTypes = userConfig.overrideNativeTypes
    ? userConfig.types || []
    : [...defaultConfig.types, ...(userConfig.types || [])]

  const filteredTypes = allTypes.filter(type =>
    userConfig.skipTypes ? !userConfig.skipTypes.includes(type.name) : true
  )

  const config = {
    ...defaultConfig,
    ...userConfig,
    types: filteredTypes,
    scopes: userConfig.scopes
  }

  return config
}

/**
 * Retourne l'émoji associé à chaque type de commit
 * @param {object} { type, symbol } les options de configuration
 * @returns un objet contenant les associations type de commit -> émoji
 */
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

/**
 * Valide un champ input dont la valeur est requise
 * @param {string} input la valeur d'input à tester
 * @returns `true` si l'input est renseigné, sinon un message d'erreur à afficher dans l'input
 */
async function requiredField(input) {
  return input.length === 0 ? 'Il faut renseigner une valeur' : true
}

/**
 * Crée l'objet inquier.js contenant les différentes questions à poser. Pour ce faire, on va lire les types et scopes
 * de la configuration courante. Si rien n'est renseigné, des questions savamment choisies seront posées par défaut.
 * @param {Object} config la configuration extraite d'un des fichiers possibles de configuration
 * @return {Array} un tableau de questions au format `inquier.js`
 */
async function createQuestions(config) {
  const currentGitBranchName = await getCurrentBranchName()

  return [
    {
      type: 'list',
      name: 'type',
      choices: getEmojiChoices(config),
      message: config.questions?.type || 'Type de commit:'
    },
    {
      type: config.scopes ? 'list' : 'input',
      name: 'scope',
      message: config.questions?.scope || 'Cadre du commit (optionnel):',
      choices: config.scopes && config.scopes.map(scope => scope.name),
      when: !config.skipQuestions.includes('scope')
    },
    {
      type: 'maxlength-input',
      name: 'description',
      message: config.questions?.description || 'Description:',
      maxLength: config.descriptionMaxLength,
      validate: requiredField
    },
    {
      type: 'input',
      name: 'body',
      message: config.questions?.body || 'Référence ticket:',
      validate: requiredField,
      default: currentGitBranchName,
      when: !config.skipQuestions.includes('body')
    },
    {
      type: 'input',
      name: 'breaking_change',
      message: config.questions && config.questions.body ? config.questions.body : 'Breaking change ? (y/N):',
      when: !config.skipQuestions.includes('breaking_change')
    }
  ]
}

/**
 * Formate le message de commit git à partir des réponses fournies.
 * @param {Object} answers réponses récupérées grâce à `inquier.js`
 * @param {Object} config la configuration extraite d'un des fichiers possibles de configuration
 * @return {String} le message de commit git formaté
 */
function formatCommitMessage(answers, config) {
  const { columns } = process.stdout

  const type = answers.type.name
  const description = answers.description.trim()
  const hasBreakingChange = answers.breaking_change === 'y'
  const emoji = config.types.find(type => type.code === answers.type.emoji).emoji
  const body = answers.body?.trim()

  let scope = ''
  if (answers.scope) {
    if (config.scopes) {
      scope = `(${config.scopes.find(scope => scope.name === answers.scope).value.trim()})`
    } else {
      scope = `(${answers.scope})`
    }
  }

  // ajout du breaking change si nécessaire
  if (hasBreakingChange) {
    scope += '!'
  }

  const commitMessage = config.format
    .replace(/{emoji}/g, emoji)
    .replace(/{type}/g, type)
    .replace(/{scope}/g, scope)
    .replace(/{description}/g, description)
    .replace(/\s+/g, ' ')

  const head = truncate(commitMessage, columns)
  const messageBody = body ? `Ref: ${body}` : null

  return [head, messageBody]
    .filter(Boolean)
    .join('\n\n')
    .trim()
}

/**
 * Affiche de manière interactive les questions à poser à l'utilisateur pour obtenir un message de commit git.
 * @param {commitizen} cz objet Commitizen
 * @return {String} le message git formaté selon les questions posées à l'utilisateur
 */
async function promptCommitMessage(cz) {
  cz.prompt.registerPrompt('maxlength-input', require('inquirer-maxlength-input-prompt'))

  const config = await getConfig()
  console.log(getBigTitle(config))

  const questions = await createQuestions(config)
  const answers = await cz.prompt(questions)
  const message = formatCommitMessage(answers, config)

  return message
}

/**
 * Exporte un objet contenant une méthode `prompter`, utilisé par `commitizen`
 * @type {Object}
 */
module.exports = {
  prompter: (cz, commit) => {
    promptCommitMessage(cz).then(commit)
  }
}
