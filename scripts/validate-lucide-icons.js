#!/usr/bin/env node
/**
 * Validates every named import from 'lucide-react-native' anywhere in
 * app/ and src/ against the package's actual exported icon names.
 *
 * Why this exists: lucide-react-native's TypeScript declarations are
 * permissive enough (or the package's type-checking surface is loose
 * enough) that importing a renamed/nonexistent icon name does NOT fail
 * `tsc --noEmit`, `eslint`, or even `expo export` — it only fails
 * silently at runtime (the icon renders as nothing). This bit us
 * concretely in Phase 1/2/3: `Home`, `Code2`, `CheckCircle2`,
 * `PlayCircle`, and `AlertTriangle` were all used before being caught,
 * because lucide renamed them (to `House`, `Code`, `CircleCheckBig`,
 * `CirclePlay`, `TriangleAlert`) in the installed version and nothing in
 * the normal verification pipeline caught it.
 *
 * Run with: node scripts/validate-lucide-icons.js
 * Exits non-zero (and lists the bad imports) if anything doesn't match.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const scanDirs = ['app', 'src'];
const iconsDeclarationFile = path.join(
  projectRoot,
  'node_modules/lucide-react-native/dist/icons.d.ts'
);

function getRealExportNames() {
  const content = fs.readFileSync(iconsDeclarationFile, 'utf-8');
  const match = content.match(/export \{ ([^}]+) \};/);
  if (!match) {
    throw new Error('Could not parse icons.d.ts — lucide-react-native package shape may have changed.');
  }
  return new Set(match[1].split(',').map((s) => s.trim()));
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function findLucideImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react-native['"]/g;
  const found = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const names = match[1].split(',').map((s) => s.trim()).filter(Boolean);
    found.push(...names);
  }
  return found;
}

function main() {
  const realExports = getRealExportNames();
  const issues = [];

  for (const dir of scanDirs) {
    const fullDir = path.join(projectRoot, dir);
    if (!fs.existsSync(fullDir)) continue;

    for (const file of walk(fullDir)) {
      const names = findLucideImports(file);
      for (const name of names) {
        if (!realExports.has(name)) {
          issues.push({ file: path.relative(projectRoot, file), name });
        }
      }
    }
  }

  if (issues.length > 0) {
    console.error(`\n✖ Found ${issues.length} invalid lucide-react-native icon import(s):\n`);
    for (const { file, name } of issues) {
      console.error(`  ${file}: "${name}" is not exported by the installed lucide-react-native version`);
    }
    console.error('\nCheck node_modules/lucide-react-native/dist/icons.d.ts for the real current name.\n');
    process.exit(1);
  } else {
    console.log('✓ All lucide-react-native icon imports are valid.');
  }
}

main();
