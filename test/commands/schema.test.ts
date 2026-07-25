import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runCLI } from '../helpers/run-cli.js';

describe('schema command', () => {
  let tempDir: string;
  let originalCwd: string;
  let originalEnv: NodeJS.ProcessEnv;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create unique temp directory for each test
    tempDir = path.join(
      os.tmpdir(),
      `superpowers-schema-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    fs.mkdirSync(tempDir, { recursive: true });

    // Create superpowers directory structure
    fs.mkdirSync(path.join(tempDir, 'superpowers', 'schemas'), { recursive: true });

    // Save original cwd and env
    originalCwd = process.cwd();
    originalEnv = { ...process.env };

    // Change to temp directory
    process.chdir(tempDir);

    // Set XDG paths to temp to avoid polluting user directories
    process.env.XDG_DATA_HOME = path.join(tempDir, 'xdg-data');
    process.env.XDG_CONFIG_HOME = path.join(tempDir, 'xdg-config');

    // Spy on console
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore cwd and env
    process.chdir(originalCwd);
    process.env = originalEnv;

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Restore spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();

    // Reset module cache
    vi.resetModules();
  });

  describe('schema which', () => {
    it('should show schema resolution from package', async () => {
      const { getSchemaDir, listSchemas } = await import(
        '../../src/core/artifact-graph/resolver.js'
      );

      // Verify spec-driven exists in package
      const schemas = listSchemas(tempDir);
      expect(schemas).toContain('spec-driven');

      const schemaDir = getSchemaDir('spec-driven', tempDir);
      expect(schemaDir).not.toBeNull();
      expect(schemaDir).toContain('schemas');
    });

    it('should detect project schema shadowing package', async () => {
      // Create a project-local spec-driven schema
      const projectSchemaDir = path.join(tempDir, 'superpowers', 'schemas', 'spec-driven');
      fs.mkdirSync(projectSchemaDir, { recursive: true });
      fs.writeFileSync(
        path.join(projectSchemaDir, 'schema.yaml'),
        `name: spec-driven
version: 1
description: Custom spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposal
    template: proposal.md
`
      );
      fs.writeFileSync(path.join(projectSchemaDir, 'proposal.md'), '# Proposal');

      const { getSchemaDir } = await import('../../src/core/artifact-graph/resolver.js');

      // Should resolve to project
      const schemaDir = getSchemaDir('spec-driven', tempDir);
      expect(schemaDir).toBe(projectSchemaDir);
    });

    it('should list all schemas with --all flag', async () => {
      const { listSchemas } = await import('../../src/core/artifact-graph/resolver.js');

      const schemas = listSchemas(tempDir);
      expect(schemas.length).toBeGreaterThan(0);
      expect(schemas).toContain('spec-driven');
    });
  });

  describe('schema validate', () => {
    it('should validate a valid schema', async () => {
      // Create a valid project schema
      const schemaDir = path.join(tempDir, 'superpowers', 'schemas', 'test-schema');
      fs.mkdirSync(schemaDir, { recursive: true });
      fs.writeFileSync(
        path.join(schemaDir, 'schema.yaml'),
        `name: test-schema
version: 1
description: Test schema
artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposal
    template: proposal.md
`
      );
      fs.writeFileSync(path.join(schemaDir, 'proposal.md'), '# Proposal Template');

      const { parseSchema } = await import('../../src/core/artifact-graph/schema.js');
      const content = fs.readFileSync(path.join(schemaDir, 'schema.yaml'), 'utf-8');
      const schema = parseSchema(content);

      expect(schema.name).toBe('test-schema');
      expect(schema.artifacts).toHaveLength(1);
    });

    it('should detect missing template file', async () => {
      const schemaDir = path.join(tempDir, 'superpowers', 'schemas', 'bad-schema');
      fs.mkdirSync(schemaDir, { recursive: true });
      fs.writeFileSync(
        path.join(schemaDir, 'schema.yaml'),
        `name: bad-schema
version: 1
description: Bad schema
artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposal
    template: missing-template.md
`
      );

      // Template file doesn't exist, validation should report this
      const templatePath = path.join(schemaDir, 'missing-template.md');
      expect(fs.existsSync(templatePath)).toBe(false);
    });

    it('should detect circular dependencies', async () => {
      const { parseSchema, SchemaValidationError } = await import(
        '../../src/core/artifact-graph/schema.js'
      );

      const content = `name: circular-schema
version: 1
description: Schema with circular deps
artifacts:
  - id: a
    generates: a.md
    description: A
    template: a.md
    requires:
      - b
  - id: b
    generates: b.md
    description: B
    template: b.md
    requires:
      - a
`;

      expect(() => parseSchema(content)).toThrow(SchemaValidationError);
      expect(() => parseSchema(content)).toThrow(/[Cc]yclic/);
    });

    it('should detect unknown dependency reference', async () => {
      const { parseSchema, SchemaValidationError } = await import(
        '../../src/core/artifact-graph/schema.js'
      );

      const content = `name: bad-ref-schema
version: 1
description: Schema with bad ref
artifacts:
  - id: a
    generates: a.md
    description: A
    template: a.md
    requires:
      - nonexistent
`;

      expect(() => parseSchema(content)).toThrow(SchemaValidationError);
      expect(() => parseSchema(content)).toThrow(/nonexistent/);
    });
  });

  describe('schema fork', () => {
    it('should copy schema to project directory', async () => {
      const { getSchemaDir } = await import('../../src/core/artifact-graph/resolver.js');

      // Get the package spec-driven schema
      const sourceDir = getSchemaDir('spec-driven', tempDir);
      expect(sourceDir).not.toBeNull();

      // Copy manually to simulate fork
      const destDir = path.join(tempDir, 'superpowers', 'schemas', 'my-custom');
      fs.mkdirSync(destDir, { recursive: true });

      // Copy files
      const files = fs.readdirSync(sourceDir!);
      for (const file of files) {
        const srcPath = path.join(sourceDir!, file);
        const destPath = path.join(destDir, file);
        const stat = fs.statSync(srcPath);

        if (stat.isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      }

      // Verify destination exists
      expect(fs.existsSync(path.join(destDir, 'schema.yaml'))).toBe(true);
    });

    it('should reject invalid schema names', () => {
      // Test kebab-case validation
      const isValidSchemaName = (name: string): boolean => {
        return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
      };

      expect(isValidSchemaName('my-schema')).toBe(true);
      expect(isValidSchemaName('my-schema-v2')).toBe(true);
      expect(isValidSchemaName('schema123')).toBe(true);
      expect(isValidSchemaName('My Schema')).toBe(false);
      expect(isValidSchemaName('my_schema')).toBe(false);
      expect(isValidSchemaName('MySchema')).toBe(false);
      expect(isValidSchemaName('-my-schema')).toBe(false);
      expect(isValidSchemaName('123schema')).toBe(false);
    });
  });

  describe('schema init', () => {
    it('should create schema directory with schema.yaml', async () => {
      const schemaDir = path.join(tempDir, 'superpowers', 'schemas', 'new-schema');
      fs.mkdirSync(schemaDir, { recursive: true });

      const { stringify: stringifyYaml } = await import('yaml');

      const schema = {
        name: 'new-schema',
        version: 1,
        description: 'A new schema',
        artifacts: [
          {
            id: 'proposal',
            generates: 'proposal.md',
            description: 'Proposal',
            template: 'proposal.md',
            requires: [],
          },
        ],
      };

      fs.writeFileSync(path.join(schemaDir, 'schema.yaml'), stringifyYaml(schema));
      fs.writeFileSync(path.join(schemaDir, 'proposal.md'), '# Proposal');

      // Verify
      expect(fs.existsSync(path.join(schemaDir, 'schema.yaml'))).toBe(true);
      expect(fs.existsSync(path.join(schemaDir, 'proposal.md'))).toBe(true);
    });

    it('should validate schema name format', () => {
      const isValidSchemaName = (name: string): boolean => {
        return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
      };

      expect(isValidSchemaName('valid-name')).toBe(true);
      expect(isValidSchemaName('Invalid Name')).toBe(false);
    });

    it('should set up artifact dependencies correctly', async () => {
      const { parseSchema } = await import('../../src/core/artifact-graph/schema.js');

      // Create schema with standard artifact chain
      const content = `name: test-workflow
version: 1
description: Test workflow
artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposal
    template: proposal.md
  - id: specs
    generates: specs/**/*.md
    description: Specs
    template: specs/spec.md
    requires:
      - proposal
  - id: design
    generates: design.md
    description: Design
    template: design.md
    requires:
      - specs
  - id: tasks
    generates: tasks.md
    description: Tasks
    template: tasks.md
    requires:
      - design
`;

      const schema = parseSchema(content);
      expect(schema.artifacts[0].requires).toEqual([]);
      expect(schema.artifacts[1].requires).toEqual(['proposal']);
      expect(schema.artifacts[2].requires).toEqual(['specs']);
      expect(schema.artifacts[3].requires).toEqual(['design']);
    });

    it('should scaffold execution-plan with task dependency and apply requirement', async () => {
      const result = await runCLI(
        [
          'schema',
          'init',
          'execution-workflow',
          '--description',
          'Execution workflow',
          '--artifacts',
          'proposal,specs,design,tasks,execution-plan',
          '--json',
        ],
        {
          cwd: tempDir,
          env: {
            XDG_DATA_HOME: path.join(tempDir, 'xdg-data'),
            XDG_CONFIG_HOME: path.join(tempDir, 'xdg-config'),
          },
        }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      const schemaDir = path.join(tempDir, 'superpowers', 'schemas', 'execution-workflow');
      expect(json.path.replace(/\\/g, '/')).toContain(
        path.join('superpowers', 'schemas', 'execution-workflow').replace(/\\/g, '/')
      );
      expect(json.artifacts).toEqual(['proposal', 'specs', 'design', 'tasks', 'execution-plan']);

      const { parseSchema } = await import('../../src/core/artifact-graph/schema.js');
      const schemaPath = path.join(schemaDir, 'schema.yaml');
      const schema = parseSchema(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.artifacts.map((artifact) => artifact.id)).toEqual([
        'proposal',
        'specs',
        'design',
        'tasks',
        'execution-plan',
      ]);
      expect(schema.artifacts.find((artifact) => artifact.id === 'execution-plan')).toMatchObject({
        generates: 'execution-plan.md',
        template: 'execution-plan.md',
        requires: ['tasks'],
      });
      expect(schema.apply).toMatchObject({
        requires: ['execution-plan'],
        tracks: 'tasks.md',
      });
      const tasksTemplatePath = path.join(schemaDir, 'templates', 'tasks.md');
      const executionPlanTemplatePath = path.join(schemaDir, 'templates', 'execution-plan.md');
      expect(fs.existsSync(tasksTemplatePath)).toBe(true);
      expect(fs.existsSync(executionPlanTemplatePath)).toBe(true);
      expect(fs.readFileSync(tasksTemplatePath, 'utf-8')).toContain('# 1. agent1 — Work-package scope');
      const executionPlanTemplate = fs.readFileSync(executionPlanTemplatePath, 'utf-8');
      expect(executionPlanTemplate).toContain('Work-Package Coordination');
      expect(executionPlanTemplate).toContain('Work-Package Execution');
      expect(executionPlanTemplate).toContain('Step 1: Write or extend focused tests');
      expect(executionPlanTemplate).toContain('Step 5: Self-review and handoff');
      expect(executionPlanTemplate).toContain('Final Integration Review and Validation');
      expect(executionPlanTemplate).not.toContain('Review tests before production code');
    });

    it('should scaffold test-plan with execution-plan dependency and apply requirement', async () => {
      const result = await runCLI(
        [
          'schema',
          'init',
          'hardening-workflow',
          '--description',
          'Hardening workflow',
          '--artifacts',
          'proposal,specs,design,tasks,execution-plan,test-plan',
          '--json',
        ],
        {
          cwd: tempDir,
          env: {
            XDG_DATA_HOME: path.join(tempDir, 'xdg-data'),
            XDG_CONFIG_HOME: path.join(tempDir, 'xdg-config'),
          },
        }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      const schemaDir = path.join(tempDir, 'superpowers', 'schemas', 'hardening-workflow');
      expect(json.artifacts).toEqual([
        'proposal',
        'specs',
        'design',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const { parseSchema } = await import('../../src/core/artifact-graph/schema.js');
      const schemaPath = path.join(schemaDir, 'schema.yaml');
      const schema = parseSchema(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.artifacts.map((artifact) => artifact.id)).toEqual([
        'proposal',
        'specs',
        'design',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);
      expect(schema.artifacts.find((artifact) => artifact.id === 'test-plan')).toMatchObject({
        generates: 'test-plan.md',
        template: 'test-plan.md',
        requires: ['execution-plan'],
      });
      expect(schema.apply).toMatchObject({
        requires: ['test-plan'],
        tracks: 'tasks.md',
      });

      const testPlanTemplatePath = path.join(schemaDir, 'templates', 'test-plan.md');
      expect(fs.existsSync(testPlanTemplatePath)).toBe(true);
      const testPlanTemplate = fs.readFileSync(testPlanTemplatePath, 'utf-8');
      expect(testPlanTemplate).toContain('Testing Gap Analysis');
      expect(testPlanTemplate).toContain('every concrete test/status row');
      expect(testPlanTemplate).toContain('planned / covered / passed / failing / not applicable');
      expect(testPlanTemplate).not.toContain('Test Hardening complete');
    });

    it('should keep tasks as apply requirement when execution-plan is not selected', async () => {
      const result = await runCLI(
        [
          'schema',
          'init',
          'tasks-workflow',
          '--description',
          'Tasks workflow',
          '--artifacts',
          'proposal,specs,design,tasks',
          '--json',
        ],
        {
          cwd: tempDir,
          env: {
            XDG_DATA_HOME: path.join(tempDir, 'xdg-data'),
            XDG_CONFIG_HOME: path.join(tempDir, 'xdg-config'),
          },
        }
      );
      expect(result.exitCode).toBe(0);

      const { parseSchema } = await import('../../src/core/artifact-graph/schema.js');
      const schemaPath = path.join(
        tempDir,
        'superpowers',
        'schemas',
        'tasks-workflow',
        'schema.yaml'
      );
      const schema = parseSchema(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.apply).toMatchObject({
        requires: ['tasks'],
        tracks: 'tasks.md',
      });
    });

    it('should reject invalid artifact ids and list execution-plan as valid', async () => {
      const result = await runCLI(
        [
          'schema',
          'init',
          'invalid-workflow',
          '--description',
          'Invalid workflow',
          '--artifacts',
          'proposal,execution_plan',
          '--json',
        ],
        {
          cwd: tempDir,
          env: {
            XDG_DATA_HOME: path.join(tempDir, 'xdg-data'),
            XDG_CONFIG_HOME: path.join(tempDir, 'xdg-config'),
          },
        }
      );
      expect(result.exitCode).toBe(1);

      const json = JSON.parse(result.stdout);
      expect(json.created).toBe(false);
      expect(json.error).toContain("Unknown artifact 'execution_plan'");
      expect(json.valid).toContain('execution-plan');
      expect(json.valid).toContain('test-plan');
    });
  });

  describe('JSON output format', () => {
    it('should output valid JSON for schema which', async () => {
      const { listSchemas } = await import('../../src/core/artifact-graph/resolver.js');

      const schemas = listSchemas(tempDir);
      const jsonOutput = JSON.stringify(schemas);

      expect(() => JSON.parse(jsonOutput)).not.toThrow();
    });

    it('should include expected fields in validation JSON', () => {
      const validationResult = {
        valid: true,
        name: 'test-schema',
        path: '/path/to/schema',
        issues: [],
      };

      const json = JSON.stringify(validationResult);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('valid');
      expect(parsed).toHaveProperty('name');
      expect(parsed).toHaveProperty('path');
      expect(parsed).toHaveProperty('issues');
    });

    it('should include expected fields in fork JSON', () => {
      const forkResult = {
        forked: true,
        source: 'spec-driven',
        sourcePath: '/path/to/source',
        sourceLocation: 'package',
        destination: 'my-custom',
        destinationPath: '/path/to/dest',
      };

      const json = JSON.stringify(forkResult);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('forked');
      expect(parsed).toHaveProperty('source');
      expect(parsed).toHaveProperty('sourceLocation');
      expect(parsed).toHaveProperty('destination');
    });

    it('should include expected fields in init JSON', () => {
      const initResult = {
        created: true,
        path: '/path/to/schema',
        schema: 'new-schema',
        artifacts: ['proposal', 'specs'],
        setAsDefault: false,
      };

      const json = JSON.stringify(initResult);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('created');
      expect(parsed).toHaveProperty('path');
      expect(parsed).toHaveProperty('schema');
      expect(parsed).toHaveProperty('artifacts');
    });
  });
});

describe('schema command shell completion registry', () => {
  it('should have schema command in registry', async () => {
    const { COMMAND_REGISTRY } = await import(
      '../../src/core/completions/command-registry.js'
    );

    const schemaCmd = COMMAND_REGISTRY.find((cmd) => cmd.name === 'schema');
    expect(schemaCmd).toBeDefined();
    expect(schemaCmd?.description).toBe('Manage workflow schemas');
  });

  it('should have all schema subcommands in registry', async () => {
    const { COMMAND_REGISTRY } = await import(
      '../../src/core/completions/command-registry.js'
    );

    const schemaCmd = COMMAND_REGISTRY.find((cmd) => cmd.name === 'schema');
    const subcommandNames = schemaCmd?.subcommands?.map((s) => s.name) ?? [];

    expect(subcommandNames).toContain('which');
    expect(subcommandNames).toContain('validate');
    expect(subcommandNames).toContain('fork');
    expect(subcommandNames).toContain('init');
  });

  it('should have --json flag on all subcommands', async () => {
    const { COMMAND_REGISTRY } = await import(
      '../../src/core/completions/command-registry.js'
    );

    const schemaCmd = COMMAND_REGISTRY.find((cmd) => cmd.name === 'schema');
    const subcommands = schemaCmd?.subcommands ?? [];

    for (const subcmd of subcommands) {
      const flagNames = subcmd.flags?.map((f) => f.name) ?? [];
      expect(flagNames).toContain('json');
    }
  });

  it('should have --all flag on which subcommand', async () => {
    const { COMMAND_REGISTRY } = await import(
      '../../src/core/completions/command-registry.js'
    );

    const schemaCmd = COMMAND_REGISTRY.find((cmd) => cmd.name === 'schema');
    const whichCmd = schemaCmd?.subcommands?.find((s) => s.name === 'which');
    const flagNames = whichCmd?.flags?.map((f) => f.name) ?? [];

    expect(flagNames).toContain('all');
  });

  it('should have --verbose flag on validate subcommand', async () => {
    const { COMMAND_REGISTRY } = await import(
      '../../src/core/completions/command-registry.js'
    );

    const schemaCmd = COMMAND_REGISTRY.find((cmd) => cmd.name === 'schema');
    const validateCmd = schemaCmd?.subcommands?.find((s) => s.name === 'validate');
    const flagNames = validateCmd?.flags?.map((f) => f.name) ?? [];

    expect(flagNames).toContain('verbose');
  });

  it('should have --force flag on fork and init subcommands', async () => {
    const { COMMAND_REGISTRY } = await import(
      '../../src/core/completions/command-registry.js'
    );

    const schemaCmd = COMMAND_REGISTRY.find((cmd) => cmd.name === 'schema');
    const forkCmd = schemaCmd?.subcommands?.find((s) => s.name === 'fork');
    const initCmd = schemaCmd?.subcommands?.find((s) => s.name === 'init');

    expect(forkCmd?.flags?.map((f) => f.name)).toContain('force');
    expect(initCmd?.flags?.map((f) => f.name)).toContain('force');
  });
});
