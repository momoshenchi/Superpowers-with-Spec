import * as fs from 'node:fs';
import * as path from 'node:path';
import fg from 'fast-glob';
import { FileSystemUtils } from '../../utils/file-system.js';

const SUPPORTED_ATTACHMENT_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.txt',
  '.md',
  '.markdown',
  '.csv',
]);

export interface AttachmentReference {
  relativePath: string;
  absolutePath: string;
}

export async function discoverAttachmentReferences(
  changeDir: string,
  artifactFiles: string[]
): Promise<Record<string, string>> {
  const attachmentsDir = path.resolve(changeDir, 'attachments');
  const references = new Map<string, string>();
  const markdownFiles = await expandArtifactFiles(artifactFiles);

  for (const artifactFile of markdownFiles) {
    let content: string;
    try {
      content = await fs.promises.readFile(artifactFile, 'utf-8');
    } catch {
      continue;
    }

    for (const relativePath of extractMarkdownAttachmentTargets(content)) {
      const resolvedPath = path.resolve(changeDir, ...relativePath.split('/'));
      const containment = path.relative(attachmentsDir, resolvedPath);
      if (containment.startsWith('..') || path.isAbsolute(containment)) {
        continue;
      }

      const extension = path.extname(resolvedPath).toLowerCase();
      if (!SUPPORTED_ATTACHMENT_EXTENSIONS.has(extension)) {
        continue;
      }

      try {
        const stat = await fs.promises.stat(resolvedPath);
        if (!stat.isFile()) {
          continue;
        }
      } catch {
        continue;
      }

      references.set(relativePath, resolvedPath);
    }
  }

  return Object.fromEntries([...references.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

async function expandArtifactFiles(artifactFiles: string[]): Promise<string[]> {
  const expanded = new Set<string>();

  for (const artifactFile of artifactFiles) {
    if (isGlobPattern(artifactFile)) {
      const matches = await fg(FileSystemUtils.toPosixPath(artifactFile), { onlyFiles: true });
      for (const match of matches) {
        expanded.add(path.resolve(match));
      }
      continue;
    }

    expanded.add(path.resolve(artifactFile));
  }

  return [...expanded].sort();
}

function extractMarkdownAttachmentTargets(content: string): string[] {
  const targets: string[] = [];
  const markdownLinkPattern = /!?\[[^\]]*]\(\s*([^)\s]+)(?:\s+["'][^)]*["'])?\s*\)/g;
  let match: RegExpExecArray | null;

  while ((match = markdownLinkPattern.exec(content)) !== null) {
    const target = match[1];
    if (target.startsWith('attachments/')) {
      targets.push(target);
    }
  }

  return targets;
}

function isGlobPattern(pattern: string): boolean {
  return pattern.includes('*') || pattern.includes('?') || pattern.includes('[');
}
