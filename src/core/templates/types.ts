/**
 * Core template types for skills and slash commands.
 */

export interface SkillReferenceFile {
  relativePath: string;
  content: string;
}

export interface SkillTemplate {
  name: string;
  description: string;
  instructions: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  references?: SkillReferenceFile[];
}

export interface CommandTemplate {
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}
