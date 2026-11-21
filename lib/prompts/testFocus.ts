export type TestFocus =
  | "critical"
  | "positive"
  | "negative"
  | "edge"
  | "smoke"
  | "balanced";

export const ALLOWED_TEST_FOCUS: TestFocus[] = [
  "critical",
  "positive",
  "negative",
  "edge",
  "smoke",
  "balanced",
];

export function getTestFocusInstructions(
  focus: TestFocus
): string {
  switch (focus) {
    case "critical":
      return `
TEST FOCUS: CRITICAL REGRESSION

PURPOSE:

Create the smallest useful regression suite that protects
the core functionality of this module.

This mode is intended for QA Automation Engineers who need
to build a useful regression framework quickly for an
already-developed product.

Generate a MAXIMUM of 5 test cases.

IMPORTANT:

- Fewer than 5 tests are completely acceptable.
- Never create filler tests just to reach 5.
- Prefer 3 excellent tests over 5 weak tests.
- Cover only functionality whose failure would seriously
  affect the user or the main business flow.

PRIORITY ORDER:

1. The primary successful user flow.
2. The most important failure or rejection flow.
3. Mandatory-field or essential validation behavior.
4. One important alternative flow if it materially affects
   the core functionality.
5. One additional critical risk only if clearly justified.

For a typical login module, strong regression coverage may be:

- Successful login with valid credentials.
- Login rejected with invalid credentials.
- Login cannot proceed when required credentials are missing.

Do NOT automatically create separate tests for every
possible invalid username/password combination.

DO NOT include:

- Cosmetic checks.
- Colors.
- Fonts.
- Spacing.
- Layout-only checks.
- Minor text checks.
- Every possible field permutation.
- Duplicate validation tests.
- Low-risk UI details.
- Exhaustive combinations.
- Technical HTML checks.
- Tests that provide little regression value.

Think like an Automation QA Engineer deciding:

"If I only had time to automate a few tests today,
which tests would protect this functionality the most?"
`;

    case "positive":
      return `
TEST FOCUS: POSITIVE TESTS

Generate ONLY the most important successful user flows.

Maximum 5 tests.

Focus on:

- Valid user actions.
- Valid inputs.
- Successful completion of the main functionality.
- Important alternative successful paths.

Do NOT generate negative tests.
Do NOT generate edge cases unless they are required
for a valid primary flow.

Avoid duplicate happy-path variations.
`;

    case "negative":
      return `
TEST FOCUS: NEGATIVE TESTS

Generate ONLY the most important failure and rejection scenarios.

Maximum 5 tests.

Focus on:

- Invalid input.
- Missing mandatory information.
- Rejected user actions.
- Important validation behavior.
- Prevention of invalid submission.

Do not invent specific error messages unless they are
supported by the DOM.

Do NOT generate positive happy-path tests.
Avoid testing every possible invalid combination.
`;

    case "edge":
      return `
TEST FOCUS: EDGE CASES

Generate ONLY meaningful boundary and edge scenarios.

Maximum 5 tests.

Generate an edge case only when the DOM provides evidence
that the boundary or unusual condition is relevant.

Examples:

- Required vs empty value.
- Maximum supported length.
- Minimum or maximum numeric value.
- Available limits.
- Boundary selections.
- Optional vs mandatory values.

Do NOT invent limits that are not supported by the DOM.

Do NOT generate ordinary happy-path or generic negative tests.
`;

    case "smoke":
      return `
TEST FOCUS: SMOKE TESTS

Generate only the minimum tests required to confirm that
the core functionality is available after a deployment.

Maximum 3 tests.

Prefer:

- One primary happy-path flow.
- One essential page/component availability check when needed.
- One additional business-critical flow only when necessary.

Smoke coverage must be extremely small and fast.

Do NOT include detailed validation permutations,
edge cases, cosmetic checks, or low-risk scenarios.
`;

    case "balanced":
      return `
TEST FOCUS: BALANCED COVERAGE

Generate a small balanced regression suite.

Maximum 5 tests.

Prioritize approximately:

- 2 important positive scenarios.
- 2 important negative scenarios.
- 1 meaningful edge case when supported by the DOM.

This distribution is guidance, not a quota.

If the module is simple, generate fewer tests.

Always prioritize business risk over achieving
a specific category count.

Do NOT create filler tests.
Do NOT create cosmetic or implementation-detail tests.
`;

    default:
      return "";
  }
}