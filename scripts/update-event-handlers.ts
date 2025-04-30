import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// Given a file path, compute a short module name for logging:
function getModuleName(filePath: string): string {
  const parts = filePath.split(path.sep);
  const name = parts.slice(parts.indexOf('src')).join('/').replace(/\\.ts$/, '');
  return name;
}

// Replace stubs with real handlers:
function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  const moduleName = getModuleName(filePath);

  // onFileWrite
  content = content.replace(
    /export function onFileWrite\\s*\\(([^)]*)\\)\\s*\\{\\s*\\/\\* no-op \\*\\/\\s*\\}/g,
    (_, params) =>
      \`export function onFileWrite(\${params}) {\n\
    console.log('[\${moduleName}] onFileWrite:',\${params.trim() ? ' ' + params : ''});\n\
}\`
  );

  // onSessionStart
  content = content.replace(
    /export function onSessionStart\\s*\\(([^)]*)\\)\\s*\\{\\s*\\/\\* no-op \\*\\/\\s*\\}/g,
    (_, params) =>
      \`export function onSessionStart(\${params}) {\n\
    console.log('[\${moduleName}] onSessionStart:',\${params.trim() ? ' ' + params : ''});\n\
}\`
  );

  // onCommand
  content = content.replace(
    /export function onCommand\\s*\\(([^)]*)\\)\\s*\\{\\s*\\/\\* no-op \\*\\/\\s*\\}/g,
    (_, params) =>
      \`export function onCommand(\${params}) {\n\
    console.log('[\${moduleName}] onCommand:',\${params.trim() ? ' ' + params : ''});\n\
}\`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', filePath);
}

// Find and process all .ts files under src/tools
glob('src/tools/**/*.ts', {}, (err, files) => {
  if (err) {
    console.error('Glob error:', err);
    process.exit(1);
  }
  files.forEach(processFile);
  console.log('All handlers updated.');
});
