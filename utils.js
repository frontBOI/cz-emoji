const { exec } = require('child_process')
const findUp = require('find-up')
const util = require('util')
const execPromise = util.promisify(exec)
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

/**
 * Récupère le nom de la branche git actuelle.
 */
async function getCurrentBranchName() {
  try {
    const { stdout, stderr } = await execPromise('git rev-parse --abbrev-ref HEAD')
    if (stderr) {
      throw new Error(stderr)
    }
    return stdout.trim()
  } catch (error) {
    // si le repo git vient d'être créé, on peut ne pas avoir de branche, donc on retourne une chaîne vide
    if (
      error.message.includes('unknown revision or path not in the working tree') ||
      error.message.includes('not a git repository')
    ) {
      return ''
    }

    console.error(`Error getting branch name: ${error}`)
    throw error
  }
}

/**
 * Lis le fichier package.json et retourne la version du package.
 * @returns {String} la version du package
 */
function getPackageVersion() {
  const packageJsonPath = path.join(__dirname, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  return packageJson.version
}

/**
 * Charge la configuration depuis un fichier
 * @param {string} filename le nom du fichier à partir duquel on charge la configuration
 * @returns la configuration ou null si le fichier n'existe pas
 */
async function loadConfig(filename) {
  if (!filename || typeof filename !== 'string') {
    console.warn('loadConfig: filename is undefined or not a string')
    return null
  }

  try {
    const file = JSON.parse(fs.readFileSync(filename, 'utf8'))

    // parsing général
    let config = null
    if (filename.includes('package.json')) {
      config = file.config?.['cz-frontboi'] || null
    } else {
      config = file
    }

    // ajout du chemin vers la config pour renseignement dans l'interface plus tard
    if (config) {
      config.userConfigPath = filename
    }

    return config
  } catch (e) {
    console.warn(e)
    return null
  }
}

/**
 * Parcours les répertoires à partir du répertoire courant pour trouver un fichier
 * @param {string} filename le nom du fichier à partir duquel on charge la configuration
 * @returns la configuration ou null si le fichier n'existe pas
 */
async function loadConfigUpwards(filename) {
  return findUp(filename).then(loadConfig)
}

/**
 * Génère le gros titre à afficher au début de mon outil en tant que présentation générale, avec mon nom d'auteur et l'état de la configuration utilisateur
 * @param {Object} config la configuration pour mon outil
 * @returns une chaîne de caractère avec le titre de l'outil
 */
function getBigTitle(config) {
  return `
██╗     ███████╗     ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗    ██████╗ ██████╗  ██████╗ ██████╗ ██████╗ ███████╗
██║     ██╔════╝    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝    ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔════╝
██║     █████╗      ██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║       ██████╔╝██████╔╝██║   ██║██████╔╝██████╔╝█████╗  
██║     ██╔══╝      ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║       ██╔═══╝ ██╔══██╗██║   ██║██╔═══╝ ██╔══██╗██╔══╝  
███████╗███████╗    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║       ██║     ██║  ██║╚██████╔╝██║     ██║  ██║███████╗
╚══════╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝ 
⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜
${chalk.yellow(
  `frontboi - v${getPackageVersion()}   ${chalk.gray(
    config.userConfigPath ? `Configuration chargée depuis ${config.userConfigPath}` : 'Configuration par défaut'
  )}`
)}
    `
}

module.exports = {
  loadConfig,
  getBigTitle,
  getPackageVersion,
  loadConfigUpwards,
  getCurrentBranchName
}
