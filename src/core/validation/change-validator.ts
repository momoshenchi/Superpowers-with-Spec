import path from 'path';
import fg from 'fast-glob';
import { formatChangeStatus, loadChangeContext } from '../artifact-graph/index.js';
import { Validator } from './validator.js';
import type { ValidationIssue, ValidationReport } from './types.js';

export interface ChangeValidationOptions {
  projectRoot?: string;
  strict?: boolean;
}

export async function validateChange(
  changeName: string,
  options: ChangeValidationOptions = {}
): Promise<ValidationReport> {
  const projectRoot = options.projectRoot ?? process.cwd();
  const changeDir = path.join(projectRoot, 'superpowers', 'changes', changeName);
  const validator = new Validator(options.strict ?? false);
  const context = loadChangeContext(projectRoot, changeName);

  const artifactIssues = getMissingArtifactIssues(context);
  const extraFileIssues = getExtraFileIssues(context);
  const deltaIssues = schemaRequiresDeltaSpecs(context)
    ? (await validator.validateChangeDeltaSpecs(changeDir)).issues
    : [];

  return createReport([...artifactIssues, ...extraFileIssues, ...deltaIssues], options.strict ?? false);
}

export async function validateChangeDir(
  changeDir: string,
  options: Omit<ChangeValidationOptions, 'projectRoot'> = {}
): Promise<ValidationReport> {
  const changeName = path.basename(changeDir);
  const projectRoot = path.resolve(changeDir, '../../..');
  return validateChange(changeName, { ...options, projectRoot });
}

function getMissingArtifactIssues(context: ReturnType<typeof loadChangeContext>): ValidationIssue[] {
  const status = formatChangeStatus(context);

  return status.artifacts
    .filter(artifact => artifact.status !== 'done')
    .map(artifact => ({
      level: 'ERROR' as const,
      path: `artifact:${artifact.id}`,
      message: `Missing required schema artifact "${artifact.id}" at ${artifact.outputPath}`,
    }));
}

function getExtraFileIssues(context: ReturnType<typeof loadChangeContext>): ValidationIssue[] {
  const allowedArtifactFiles = getAllowedArtifactFiles(context.changeDir, context.graph.getAllArtifacts().map(artifact => artifact.generates));
  const changeFiles = fg.sync('**/*', {
    cwd: context.changeDir,
    dot: true,
    onlyFiles: true,
  }).map(toPosixPath).sort();

  return changeFiles
    .filter(file => !isAllowedChangeFile(file, allowedArtifactFiles))
    .map(file => ({
      level: 'ERROR' as const,
      path: file,
      message: `Unexpected change file "${file}". Extra files must be declared by the schema or placed under specs/ or attachments/.`,
    }));
}

/**
 * Delta-spec validation only applies when the resolved schema declares a specs artifact.
 * Custom schemas (e.g. test-harden) that only produce design/test-plan must not fail for missing deltas.
 */
function schemaRequiresDeltaSpecs(context: ReturnType<typeof loadChangeContext>): boolean {
  return context.graph.getAllArtifacts().some(artifact => {
    if (artifact.id === 'specs') return true;
    const generates = toPosixPath(artifact.generates);
    return generates === 'specs' || generates.startsWith('specs/');
  });
}

function getAllowedArtifactFiles(changeDir: string, generatesPatterns: string[]): Set<string> {
  const allowed = new Set<string>();

  for (const pattern of generatesPatterns) {
    if (isGlobPattern(pattern)) {
      for (const match of fg.sync(toPosixPath(pattern), { cwd: changeDir, dot: true, onlyFiles: true })) {
        allowed.add(toPosixPath(match));
      }
    } else {
      allowed.add(toPosixPath(pattern));
    }
  }

  return allowed;
}

function isAllowedChangeFile(file: string, allowedArtifactFiles: Set<string>): boolean {
  return (
    file === '.superpowers.yaml' ||
    file.startsWith('specs/') ||
    file.startsWith('attachments/') ||
    allowedArtifactFiles.has(file)
  );
}

function isGlobPattern(pattern: string): boolean {
  return pattern.includes('*') || pattern.includes('?') || pattern.includes('[');
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function createReport(issues: ValidationIssue[], strict: boolean): ValidationReport {
  const errors = issues.filter(issue => issue.level === 'ERROR').length;
  const warnings = issues.filter(issue => issue.level === 'WARNING').length;
  const info = issues.filter(issue => issue.level === 'INFO').length;

  return {
    valid: strict ? errors === 0 && warnings === 0 : errors === 0,
    issues,
    summary: { errors, warnings, info },
  };
}
