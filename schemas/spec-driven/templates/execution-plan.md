## File Structure

<!--  List files before task details. Use project-relative paths that are portable across macOS, Linux, and Windows.

- Create:
  - `path/to/new-file.ts` - [Responsibility]
- Modify:
  - `path/to/existing-file.ts` - [Responsibility and expected area of change]
- Test:
  - `test/path/to/test-file.test.ts` - [Behaviors covered]

-->

## Task Plan

### Task N: [Component or Behavior]

<!-- 
**Files:**
- Create: `path/to/file.ts`
- Modify: `path/to/existing.ts`
- Test: `test/path/to/test-file.test.ts`
-->

- [ ] **Step 1: Write the failing test**
<!-- 
```ts
it('describes the specific behavior', () => {
  expect(actualBehavior()).toBe(expectedValue);
});
```
-->

- [ ] **Step 2: Run test to verify it fails**
<!-- 
Run: `pnpm exec vitest run test/path/to/test-file.test.ts`
Expected: FAIL for the missing behavior, not because of syntax errors or incorrect test setup.
-->

- [ ] **Step 3: Review test coverage before production code**
<!-- 
Check: requirement coverage, edge cases, negative paths, assertion strength, regression sensitivity, and cross-platform path behavior when paths are involved.
Expected: Review either approves the tests or identifies gaps that are fixed before Step 4.
-->

- [ ] **Step 4: Write minimal implementation**
<!-- 
```ts
export function actualBehavior() {
  return expectedValue;
}
```
-->

- [ ] **Step 5: Run verification**
<!-- 
Run: `pnpm exec vitest run test/path/to/test-file.test.ts`
Expected: PASS with the new test covering the behavior.
-->



