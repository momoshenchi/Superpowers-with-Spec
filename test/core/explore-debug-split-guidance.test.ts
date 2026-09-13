import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getExploreSkillTemplate,
  getSpExploreCommandTemplate,
} from '../../src/core/templates/skill-templates.js';

describe('explore vs debug split', () => {
  it('explore description does not trigger on investigating problems', () => {
    expect(getExploreSkillTemplate().description).not.toMatch(/investigating problems/i);
    expect(getSpExploreCommandTemplate().description).not.toMatch(/investigating problems/i);
    expect(getExploreSkillTemplate().description).toMatch(/think through|clarif/i);
    const debug = readFileSync(
      path.join(process.cwd(), 'skills/systematic-debugging/SKILL.md'),
      'utf8'
    );
    expect(debug).toMatch(/unknown-cause|cause is unknown|already identified/i);
  });
});
