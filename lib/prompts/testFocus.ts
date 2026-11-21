export type TestFocus =
  | "critical"
  | "smoke"
  | "positive"
  | "negative"
  | "edge"
  | "balanced";

export const ALLOWED_TEST_FOCUS: TestFocus[] = [
  "critical",
  "smoke",
  "positive",
  "negative",
  "edge",
  "balanced",
];

// =====================================================
// MAXIMUM NUMBER OF TESTS PER FOCUS
// =====================================================

export function getMaxTestsForFocus(
  focus: TestFocus
): number {
  switch (focus) {
    case "smoke":
      return 3;

    case "critical":
    case "positive":
    case "negative":
    case "edge":
    case "balanced":
    default:
      return 5;
  }
}

// =====================================================
// TEST FOCUS PROMPT INSTRUCTIONS
// =====================================================

export function getTestFocusInstructions(
  focus: TestFocus
): string {
  switch (focus) {

    // =================================================
    // CRITICAL REGRESSION
    // =================================================

    case "critical":
      return `
TEST FOCUS: CRITICAL REGRESSION

GOAL:

Create the smallest high-value regression suite that protects
the core functionality represented by the supplied DOM.

This mode is intended for QA Automation Engineers who need
to create a useful automation regression framework quickly
for an already-developed product.

The DOM may represent ANY functionality, page, component,
module, or workflow.

Examples may include:

- Authentication
- Search
- Checkout
- Payments
- Transfers
- Profile
- Settings
- Dashboard
- Forms
- Administration
- Navigation
- User management
- Data entry
- Product management
- Booking
- Reporting
- Any other application functionality

Do NOT assume the functionality type in advance.

First analyze the DOM and determine:

1. What functionality is represented.
2. What the primary user or business goal is.
3. What failure would create the highest regression risk.
4. Which small set of tests provides the most useful
   automation protection.

Generate a MAXIMUM of 5 tests.

Fewer tests are completely acceptable.

Prefer:

3 excellent high-value tests

over:

5 weak or repetitive tests.

PRIORITY:

1. Primary successful user/business flow.

2. Most important failure, rejection, or prevention flow.

3. Essential validation that could block or corrupt
   the main functionality.

4. Important alternative flow only when it materially
   affects the core functionality.

5. One additional high-risk scenario only when it provides
   meaningful regression protection.

AUTOMATION MINDSET:

Think like an experienced QA Automation Engineer asking:

"If I could automate only a few scenarios for this module today,
which scenarios would give the strongest regression protection?"

Prefer tests that:

- Protect core user journeys.
- Protect important business actions.
- Detect serious regressions quickly.
- Are stable enough to automate.
- Provide broad functional value.
- Are worth maintaining long-term.

DO NOT generate:

- Cosmetic checks.
- Color checks.
- Font checks.
- Spacing checks.
- Pure layout checks.
- Decorative UI checks.
- Every possible field combination.
- Every possible invalid data combination.
- Repetitive validation permutations.
- Low-risk UI details.
- Technical DOM checks.
- HTML attribute checks.
- CSS checks.
- Selector checks.
- Implementation-detail tests.
- Filler tests.

Do not invent behavior that is not supported
by the supplied DOM.
`;

    // =================================================
    // SMOKE TESTS
    // =================================================

    case "smoke":
      return `
TEST FOCUS: SMOKE TESTS

GOAL:

Create the smallest possible test suite that confirms
the represented functionality is fundamentally usable
after a deployment or build.

Generate a MAXIMUM of 3 tests.

Fewer tests are acceptable.

Focus on:

- The main functionality being available.
- The primary successful user flow.
- One additional essential business flow only when necessary.

Smoke tests must be:

- Fast.
- Stable.
- High-value.
- Suitable for frequent execution.

Do NOT include:

- Detailed validation combinations.
- Extensive negative testing.
- Edge-case exploration.
- Cosmetic checks.
- Low-risk behavior.
- Exhaustive coverage.

Think:

"What must work for us to consider this module basically alive?"
`;

    // =================================================
    // POSITIVE TESTS
    // =================================================

    case "positive":
      return `
TEST FOCUS: POSITIVE TESTS

GOAL:

Generate only the most important successful user
and business flows supported by the DOM.

Generate a MAXIMUM of 5 tests.

Fewer tests are acceptable.

Focus on:

- Valid user actions.
- Valid input.
- Successful completion of core functionality.
- Important alternative successful paths.
- Meaningful successful navigation or submission.

Do NOT generate:

- Negative scenarios.
- Invalid-data scenarios.
- Failure scenarios.
- Edge cases unless they are essential to a valid flow.
- Duplicate happy-path variations.
- Cosmetic checks.

Prefer business-important successful behavior
over minor UI interactions.
`;

    // =================================================
    // NEGATIVE TESTS
    // =================================================

    case "negative":
      return `
TEST FOCUS: NEGATIVE TESTS

GOAL:

Generate only the most important failure,
rejection, prevention, and validation scenarios
supported by the DOM.

Generate a MAXIMUM of 5 tests.

Fewer tests are acceptable.

Focus on:

- Invalid input.
- Missing required information.
- Rejected actions.
- Important validation.
- Prevention of invalid submission.
- Prevention of incorrect user actions.

Do NOT:

- Generate every possible invalid combination.
- Repeat equivalent validation scenarios.
- Invent specific error messages.
- Invent backend behavior.
- Generate ordinary positive happy paths.
- Generate cosmetic tests.

Choose negative scenarios according to regression risk.
`;

    // =================================================
    // EDGE CASES
    // =================================================

    case "edge":
      return `
TEST FOCUS: EDGE CASES

GOAL:

Generate only meaningful boundary and edge scenarios
that are supported by evidence in the DOM.

Generate a MAXIMUM of 5 tests.

Fewer tests are acceptable.

Relevant DOM evidence may include:

- required
- min
- max
- minlength
- maxlength
- numeric limits
- selectable ranges
- optional fields
- mandatory fields
- constrained inputs
- available choices

Focus on:

- Boundary values.
- Empty values where meaningful.
- Maximum supported values.
- Minimum supported values.
- Important unusual combinations.
- Input limits.

Do NOT invent boundaries or limits that are not
supported by the DOM.

Do NOT create generic edge cases simply to reach
the maximum number of tests.
`;

    // =================================================
    // BALANCED COVERAGE
    // =================================================

    case "balanced":
      return `
TEST FOCUS: BALANCED COVERAGE

GOAL:

Create a small, practical regression suite containing
a balanced selection of the most valuable scenarios.

Generate a MAXIMUM of 5 tests.

Fewer tests are acceptable.

Prefer approximately:

- 1-2 important positive scenarios.
- 1-2 important negative scenarios.
- 1 meaningful edge scenario when supported.

This distribution is guidance only.

Do NOT force every category to appear.

Always prioritize:

1. Business risk.
2. Core functionality.
3. User impact.
4. Regression value.

Do NOT generate filler tests simply to achieve
a category count.

Do NOT include cosmetic or low-value technical checks.
`;

    default:
      return "";
  }
}