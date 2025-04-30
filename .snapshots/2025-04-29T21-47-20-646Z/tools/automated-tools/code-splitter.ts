// Auto-generated vigilant enforcer for code-splitter

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export function activate() {
    console.log('[TOOL] code-splitter activated (vigilant enforcer mode)');
}

// Shared default extensions
export const SUPPORTED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.css', '.scss', '.less', '.html', '.json', '.py', '.pyx', '.pyi',
  '.c', '.cpp', '.cc', '.h', '.hpp', '.cs', '.java', '.go', '.rb', '.php', '.swift', '.rs'
];

const DEFAULT_MAX_LINES = 500;

export async function onFileWrite(event: { path: string; content: string }) {
  const ext = path.extname(event.path).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) return;

  const lineCount = event.content.split('\n').length;
  if (lineCount > DEFAULT_MAX_LINES) {
    console.log(`[CodeSplitter] Enforcing split: ${event.path} exceeds ${DEFAULT_MAX_LINES} lines.`);
    await handleSplitFile({ path: event.path, strategy: 'auto', maxLines: DEFAULT_MAX_LINES });
  }
}

export async function onSessionStart(session: { id: string; startTime: number }) {
  console.log(`[CodeSplitter] Session started: ${session.id} — scanning project for large files...`);
  const root = process.cwd();
  const files = await getFilesInDirectory(root, true, SUPPORTED_EXTENSIONS);

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    const lineCount = content.split('\n').length;
    if (lineCount > DEFAULT_MAX_LINES) {
      console.log(`[CodeSplitter] Auto-splitting ${filePath}`);
      await handleSplitFile({ path: filePath, strategy: 'auto', maxLines: DEFAULT_MAX_LINES });
    }
  }
}

export async function onCommand(command: { name: string; args: any[] }) {
  const [filePath, strategy] = command.args || [];

  if (command.name === 'code-splitter:analyze') {
    return handleAnalyzeFile({ path: filePath });
  } else if (command.name === 'code-splitter:split') {
    return handleSplitFile({ path: filePath, strategy: strategy || 'auto', maxLines: DEFAULT_MAX_LINES });
  }
}

// Shared simplified functions
export async function handleAnalyzeFile(args: { path: string }) {
  const content = await fs.readFile(args.path, 'utf8');
  const lineCount = content.split('\n').length;
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        file: args.path,
        lineCount,
        exceedsMaxLines: lineCount > DEFAULT_MAX_LINES,
      }, null, 2)
    }],
  };
}

export async function handleSplitFile(args: { path: string; strategy: string; maxLines: number }) {
  const content = await fs.readFile(args.path, 'utf8');
  const ext = path.extname(args.path);
  const baseName = path.basename(args.path, ext);
  const dir = path.dirname(args.path);
  const splitDir = path.join(dir, `${baseName}-split`);

  await fs.mkdir(splitDir, { recursive: true });

  const lines = content.split('\n');
  let part = 0;

  for (let i = 0; i < lines.length; i += args.maxLines) {
    const chunk = lines.slice(i, i + args.maxLines).join('\n');
    const outFile = path.join(splitDir, `${baseName}.part${++part}${ext}`);
    await fs.writeFile(outFile, chunk);
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        message: `Split ${args.path} into ${part} parts`,
        parts: part,
        outputDir: splitDir
      }, null, 2)
    }],
  };
}

export async function getFilesInDirectory(directory: string, recursive: boolean, extensions: string[]): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory() && recursive) {
      return getFilesInDirectory(fullPath, recursive, extensions);
    } else if (entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())) {
      return [fullPath];
    } else {
      return [];
    }
  }));

  return files.flat();
}