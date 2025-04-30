import { promises as fs } from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';

const SNAPSHOT_DIR = path.join(process.cwd(), '.snapshots');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export async function createSnapshot(targetDir = 'src') {
  const timestamp = getTimestamp();
  const snapshotPath = path.join(SNAPSHOT_DIR, timestamp);

  try {
    await fse.ensureDir(SNAPSHOT_DIR);
    await fse.copy(targetDir, snapshotPath);
    console.log(`[Snapshot] Created at: ${snapshotPath}`);
    return snapshotPath;
  } catch (err) {
    console.error('[Snapshot Error]', err);
    throw err;
  }
}

export async function listSnapshots() {
  try {
    const files = await fs.readdir(SNAPSHOT_DIR);
    return files.map(f => path.join(SNAPSHOT_DIR, f));
  } catch {
    return [];
  }
}

export async function restoreSnapshot(snapshotName, targetDir = 'src') {
  const snapshotPath = path.join(SNAPSHOT_DIR, snapshotName);
  try {
    await fse.copy(snapshotPath, targetDir, { overwrite: true });
    console.log(`[Snapshot] Restored: ${snapshotPath} -> ${targetDir}`);
  } catch (err) {
    console.error('[Restore Error]', err);
    throw err;
  }
}

// Initialize the last snapshot time
let lastSnapshotTime = 0;
const SNAPSHOT_INTERVAL = 5 * 60 * 1000; // 5 minutes

// MCP tool lifecycle hooks
export function activate() {
  console.log("[TOOL] create_snapshot activated ✅");
}

export function onFileWrite() {
  const now = Date.now();
  if (now - lastSnapshotTime > SNAPSHOT_INTERVAL) {
    createSnapshot().then(() => {
      lastSnapshotTime = now;
    }).catch((err) => {
      console.error('[Snapshot AutoFail]', err);
    });
  }
}

export function onSessionStart() {
  createSnapshot()
    .then(path => console.log(`[Session Start Snapshot] Saved: ${path}`))
    .catch(err => console.error('[Snapshot Error onSessionStart]', err));
}

export function onCommand(cmd) {
  const [action, arg] = cmd.trim().split(/\s+/);

  if (action === "snapshot") return createSnapshot(arg);
  if (action === "snaplist") return listSnapshots().then(console.log);
  if (action === "snaprestore" && arg) return restoreSnapshot(arg);
}