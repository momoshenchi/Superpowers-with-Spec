import { describe, expect, it } from 'vitest';

import {
  getCanonicalNonVisualSuiteInstructions,
  getFinalQualityGateInstructions,
} from '../../../src/core/templates/workflows/final-quality-gates.js';
import {
  getSpVerifyCommandTemplate,
  getVerifyChangeReferences,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/workflows/verify-change.js';

describe('final quality gate suite and spawn fallback', () => {
  const hardening = getCanonicalNonVisualSuiteInstructions('Test Hardening');
  const gates = getFinalQualityGateInstructions();

  it('does not fail-closed to the complete suite', () => {
    expect(hardening).not.toMatch(/fail-closed and run the complete canonical non-visual suite/);
    expect(hardening).toMatch(/Git-aware|Git-related/);
    expect(hardening).toContain(
      'record `git-aware-unavailable-recorded` for this non-`test-plan` suite stage'
    );
    expect(hardening).toContain(
      'Do not run the complete canonical suite as a pass for that stage, and do not treat empty related selection as a pass'
    );
    expect(hardening).toMatch(/Empty related selection is not a pass/);
  });

  it('falls back when spawn is missing', () => {
    expect(gates).toContain(
      'If the host cannot launch a subagent, run an equivalent same-context review, label the review mode `same-context fallback`, and continue. Missing spawn capability is not by itself gate outcome `blocked`.'
    );
    expect(gates).not.toMatch(/pause; do not silently substitute a same-context review/);
    expect(gates).not.toMatch(
      /If the host cannot launch a subagent, mark the applicable final-quality stage `blocked`/
    );
  });

  it('verify correctness does not require the complete suite', () => {
    for (const content of [
      getVerifyChangeSkillTemplate().instructions,
      getSpVerifyCommandTemplate().content,
    ]) {
      expect(content).not.toMatch(/otherwise the complete suite/);
    }
  });

  it('does not let Git-aware evidence close test-plan rows', () => {
    expect(hardening).toMatch(/Registered `test-plan.md` rows remain required/);
    expect(hardening).not.toMatch(/Git-aware output may satisfy registered TC-/);
    expect(hardening).toMatch(/both layers/i);
  });

  it('records unavailable Git-aware without complete-suite fallback', () => {
    expect(hardening).toContain('git-aware-unavailable-recorded');
    expect(hardening).toMatch(/do not run the complete canonical suite/i);
    expect(hardening).not.toMatch(/if unavailable, run the complete/i);
    expect(hardening).toContain('ran-complete-suite-optional');
    expect(hardening).toContain('git-aware-empty-expected');
  });

  it('spawns code review, simplify, and design-verify in parallel before verify', () => {
    expect(gates).toMatch(/parallel/i);
    expect(gates).not.toMatch(/run these gates in exactly this order/);
    expect(gates.indexOf('code review')).toBeLessThan(gates.indexOf('Verify (rounds'));
    expect(gates.indexOf('3. **Design verify')).toBeLessThan(gates.indexOf('4. **Verify'));
    expect(gates).toMatch(/Do not start Verify until/);
  });

  it('retries unresolved CR and DV P0 in parallel and withholds Verify', () => {
    expect(gates).toMatch(/retry only the unresolved/i);
    expect(gates).toMatch(/round four|four rounds/i);
    expect(gates).toMatch(/Do not start Verify until/);
    expect(gates).not.toMatch(
      /Do not reuse a gate worker or start a later gate before the current worker has completed/,
    );
    expect(gates).toMatch(/UI-owned paths|UI files for Design verify/i);
    expect(gates).toMatch(/Simplify.*(failed|blocked)|failed\/blocked/i);
  });

  it('reuses Hardening Git-aware when implementation and baseline are unchanged', () => {
    expect(gates).toMatch(/reuse.*Hardening suite-stage|cite that Hardening/i);
    expect(gates).toMatch(/agent-browser/);
    expect(gates).toMatch(/test-plan\.md` rows that Verify still owns|Verify still owns/i);
    expect(gates).toMatch(/baseline changed|Git baseline/i);
    expect(gates).toMatch(/Verify repair|next Verify round/i);
    expect(gates).not.toMatch(/only if Simplify or a Verify repair/i);
  });

  it('does not re-run already-passed code review because Simplify edited', () => {
    expect(gates).toMatch(/Already-passed code review SHALL NOT be re-run/i);
    expect(gates).toMatch(/Without spawn, run code review, then Simplify, then Design verify/);
  });

  it('standalone verify always preflights', () => {
    const verify = [
      getSpVerifyCommandTemplate().content,
      ...getVerifyChangeReferences().map((file) => file.content),
    ].join('\n');
    expect(verify).toMatch(/canonical non-visual/i);
    expect(verify).not.toMatch(/reuse Hardening suite-stage/i);
    expect(verify).toMatch(/When this invocation is an Apply Final Quality Gate/);
    expect(verify).toMatch(/Standalone `\/sp:verify` always runs the preflight below/);
  });
});
