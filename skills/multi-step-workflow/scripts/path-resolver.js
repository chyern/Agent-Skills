import { os } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';

/**
 * Generates a consistent project-specific temp directory path
 * based on the current working directory's hash.
 * This ensures different projects don't collide in /tmp.
 */
export function getTempDir() {
  const cwd = process.cwd();
  const hash = createHash('md5').update(cwd).digest('hex').substring(0, 8);
  const tempDir = join(os.tmpdir(), `openclaw-workflow-${hash}`);
  
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  
  return tempDir;
}
