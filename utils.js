const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)
const path = require('path')
const fs = require('fs')

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

module.exports = {
  getCurrentBranchName,
  getPackageVersion
}
