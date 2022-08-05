const { spawnSync } = require('node:child_process');

module.exports = {
  executeCommand(command, argv) {
    spawnSync(command, argv, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
  },
};
