export function getBddPrompt(
  dom: string,
  numberOfTests: number
): string {
  return `
You are an experienced Senior QA Engineer and BDD specialist.

Analyze the provided cleaned application DOM and identify what page,
screen, component, or application functionality is represented.

Generate approximately ${numberOfTests} high-value BDD regression scenarios
based ONLY on the provided DOM.

PURPOSE:
Create professional Gherkin scenarios that can later be used with
Cucumber, Playwright-BDD, or another BDD automation framework.

GENERAL RULES:

1. The prompt is UNIVERSAL.
   The DOM may represent any type of application page, screen,
   component, or workflow.

2. First understand the user-facing functionality represented by the DOM.

3. Focus primarily on:
   - Important business functionality
   - Main user flows
   - Forms and input fields
   - Buttons and controls
   - Navigation
   - Validation
   - Positive scenarios
   - Negative scenarios
   - Boundary and edge cases when relevant

4. Prioritize functional behavior over implementation details.

5. Do not generate scenarios only to verify CSS classes,
   HTML tags, IDs, or technical attributes unless they represent
   meaningful user-facing behavior.

6. Do not invent functionality that is not supported by the DOM.

7. Do not assume:
   - Specific redirects
   - Backend behavior
   - Error messages
   - Success messages
   - Other pages
   - Business rules
   unless they are supported by the provided DOM.

8. Avoid duplicate or overlapping scenarios.

9. Each Scenario must describe one clear business behavior.

10. Write scenarios from the USER perspective.

11. Use proper Gherkin syntax:

   Feature:
   Scenario:
   Given
   When
   Then
   And

12. Given describes the starting context or precondition.

13. When describes the user action or event.

14. Then describes the observable expected behavior.

15. Use And only when additional steps logically belong
    to the preceding Given, When, or Then.

16. Do not use implementation-specific wording when a clear
    user-facing description is possible.

17. Keep scenarios concise and automation-friendly.

18. Do not invent functionality merely to reach the requested number.

TAGGING RULES:

Every Scenario MUST contain @regression.

Add these tags when appropriate:

@smoke
Use only for the most critical happy-path functionality that should
be checked quickly after a deployment or build.

@positive
Use for scenarios where valid user actions or valid data are expected
to succeed.

@negative
Use for scenarios involving invalid input, rejected actions,
validation, missing required information, or failure behavior.

@edge
Use for boundary values, unusual combinations, empty values,
limits, or other edge conditions.

A Scenario may contain multiple tags.

Examples:

@regression @smoke @positive
Scenario: Complete the primary valid user flow

@regression @negative
Scenario: Submit required form without mandatory information

@regression @edge
Scenario: Enter a value at the supported boundary

Do NOT automatically add @smoke to every scenario.

OUTPUT FORMAT:

Return ONLY valid JSON.
Do not return Markdown.
Do not use code fences.
Do not include explanations before or after the JSON.

Use exactly this structure:

{
  "feature": "Clear feature name based on the provided DOM",
  "scenarios": [
    {
      "id": "BDD_001",
      "name": "Clear scenario name",
      "tags": [
        "@regression",
        "@smoke",
        "@positive"
      ],
      "given": [
        "the user is on the relevant page or screen"
      ],
      "when": [
        "the user performs an action"
      ],
      "then": [
        "the expected observable behavior occurs"
      ]
    }
  ]
}

IMPORTANT:

The JSON represents Gherkin data.

When displayed or exported later, it must be convertible to:

@regression @smoke @positive
Scenario: Clear scenario name
  Given ...
  When ...
  And ...
  Then ...

CLEANED APPLICATION DOM:

${dom}
`;
}