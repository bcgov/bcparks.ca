// Regenerates the Playwright test agents (Claude Code + GitHub Copilot).
//
// `playwright init-agents` writes its output relative to the current directory
// and hardcodes `npx playwright run-test-mcp-server`. Agent and MCP config must
// live at the repo root to be discovered, but Playwright is installed here in
// tests/e2e, so we run it from the root and then point the MCP command back here.

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
const e2eDir = path.relative(repoRoot, path.resolve(__dirname, '..'));
const playwrightBin = path.join(e2eDir, 'node_modules', '.bin', 'playwright');
const configFile = path.join(e2eDir, 'playwright.config.js');

const mcpArgs = ['--prefix', e2eDir, 'playwright', 'run-test-mcp-server', '--config', configFile];

const inRoot = (p) => path.join(repoRoot, p);
const rootSpecsExisted = fs.existsSync(inRoot('specs'));
// init-agents checks the wrong path for this file, so it always overwrites our customized workflow.
const copilotSetupSteps = inRoot('.github/workflows/copilot-setup-steps.yml');
const copilotSetupStepsContent = fs.existsSync(copilotSetupSteps) ? fs.readFileSync(copilotSetupSteps, 'utf8') : undefined;

for (const loop of ['claude', 'vscode']) {
  execFileSync(playwrightBin, ['init-agents', `--loop=${loop}`, '--config', configFile], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
}

if (copilotSetupStepsContent !== undefined)
  fs.writeFileSync(copilotSetupSteps, copilotSetupStepsContent);

// init-agents creates specs/ at the root if missing; test plans live in tests/e2e/specs.
if (!rootSpecsExisted)
  fs.rmSync(inRoot('specs'), { recursive: true, force: true });

/**
 * Updates Playwright MCP arguments in a JSON configuration file.
 * Does nothing if the file doesn't exist.
 * @param {string} file - Path to the configuration file, relative to the repository root.
 * @param {(json: object) => object} getServers - Selects the configuration's MCP server map.
 * @returns {void}
 */
function updateJson(file, getServers) {
  if (!fs.existsSync(inRoot(file)))
    return;
  const json = JSON.parse(fs.readFileSync(inRoot(file), 'utf8'));
  getServers(json)['playwright-test'].args = mcpArgs;
  fs.writeFileSync(inRoot(file), JSON.stringify(json, null, 2) + '\n');
}

updateJson('.mcp.json', (json) => json.mcpServers);
updateJson('.vscode/mcp.json', (json) => json.servers);

// Copilot agents embed the MCP server in their YAML frontmatter.
const generatedArgs = '    args:\n      - playwright\n      - run-test-mcp-server\n';
const fixedArgs = '    args:\n' + mcpArgs.map((arg) => `      - ${arg}\n`).join('');
const agentsDir = inRoot('.github/agents');
for (const file of fs.readdirSync(agentsDir).filter((f) => f.endsWith('.agent.md'))) {
  const agentPath = path.join(agentsDir, file);
  const content = fs.readFileSync(agentPath, 'utf8');
  if (!content.includes(generatedArgs))
    throw new Error(`Unexpected MCP config format in ${agentPath}; update scripts/update-agents.js`);
  fs.writeFileSync(agentPath, content.replace(generatedArgs, fixedArgs));
}

console.log(`\nMCP server now runs: npx ${mcpArgs.join(' ')}`);
