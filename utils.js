const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

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

module.exports = {
  getCurrentBranchName
}
