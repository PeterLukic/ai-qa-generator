export function getSimplePrompt(
  dom: string,
  numberOfTests: number
): string {
  return `
You are an experienced Senior QA Engineer creating a high-level regression test suite.

Analyze the provided cleaned application DOM and determine what page,
screen, component, or application functionality is represented.

Generate approximately ${numberOfTests} of the most important regression test cases
based ONLY on the provided DOM.

PURPOSE:

Create a concise, high-value regression checklist describing WHAT should
be tested without detailed execution steps.

The output must be understandable by a manual QA tester and should focus
on real user-facing behavior rather than HTML implementation details.

GENERAL RULES:

1. The prompt is UNIVERSAL.

   The DOM may represent any type of application functionality, including:
   - Login
   - Home page
   - Dashboard
   - Profile
   - Settings
   - Search
   - Forms
   - Payments
   - Transfers
   - Checkout
   - User management
   - Administration
   - Navigation
   - Any other application page or component

2. First understand what functionality is represented by the DOM.

3. Generate only regression test cases that are relevant to that functionality.

4. Focus primarily on:
   - Important user-facing functionality
   - Main user actions
   - Important business flows
   - Forms and input fields
   - Buttons and interactive controls
   - Navigation
   - Validation
   - Important displayed information
   - Positive scenarios
   - Negative scenarios
   - Boundary and edge cases when relevant

5. Prioritize important business and user functionality over cosmetic checks.

6. Each test case must represent one clear testing objective.

7. Avoid duplicate or overlapping test cases.

8. Do not create filler test cases only to reach the requested number.

9. If the DOM does not contain enough meaningful functionality,
   generate fewer high-quality test cases rather than inventing functionality.

10. Do NOT invent behavior that cannot reasonably be determined
    from the provided DOM.

11. Do NOT assume:
    - Specific backend responses
    - Specific API behavior
    - Specific redirects
    - Success messages
    - Error messages
    - Validation messages
    - Pages that are not represented
    - Business rules that cannot be inferred
    - Authentication behavior that is not visible
    - Database behavior

12. Use the DOM as evidence of available functionality,
    but describe test cases from the USER perspective.

IMPLEMENTATION DETAIL RULES:

Do NOT generate test cases primarily about:

- HTML attributes
- Element IDs
- Element names
- CSS classes
- Internal URLs
- Form action paths
- HTTP methods
- DOM hierarchy
- Framework-specific implementation details
- Technical selectors
- Internal component names
- Raw HTML structure

Convert technical DOM evidence into user-facing test objectives.

For example:

BAD:
"Verify the button has type='submit' and class='primary-button'."

GOOD:
"Verify the user can submit the form using the primary action button."

BAD:
"Verify the input has maxlength='50'."

GOOD:
"Verify the field handles the maximum supported input length."

BAD:
"Verify the anchor href is '/profile/settings'."

GOOD:
"Verify the user can navigate to the Settings page."

BAD:
"Verify the select element contains specific option values."

GOOD:
"Verify the user can select from the available options."

BAD:
"Verify the checkbox has checked='true'."

GOOD:
"Verify the selected option is displayed correctly to the user."

Only generate technical checks when the technical property directly
affects important user-visible behavior.

TEST CASE NAME RULES:

13. Test Case Name must:
    - Be short
    - Be clear
    - Describe one scenario or testing objective
    - Use QA/business language
    - Avoid HTML terminology where possible

14. Good naming examples:

    "Verify user can submit the form"

    "Verify required field validation"

    "Verify navigation to the profile section"

    "Verify user can select an available option"

    "Verify boundary value handling"

15. Avoid names such as:

    "Input element attributes"

    "Form POST configuration"

    "Button HTML properties"

    "Anchor href verification"

DESCRIPTION RULES:

16. Test Case Description must explain WHAT should be verified.

17. The description should provide enough information for a QA Engineer
    to understand the purpose of the test.

18. Keep the description concise.

19. Do NOT include detailed execution steps.

20. Do NOT include expected results.

21. Do NOT include preconditions.

22. Do NOT include execution status.

23. Do NOT include test data.

24. Do NOT include priority.

25. Do NOT include automation code.

26. Do NOT include selectors.

QUALITY RULES:

27. Prefer functional regression coverage over cosmetic coverage.

28. Include negative tests when negative behavior can reasonably
    be inferred from the available functionality.

29. Include edge or boundary tests only when the DOM provides
    relevant evidence such as:
    - min
    - max
    - maxlength
    - required fields
    - numeric inputs
    - selectable ranges
    - limits
    - optional vs mandatory inputs

30. If navigation elements are present, generate navigation tests
    based on their user-visible purpose rather than their raw URL.

31. If forms are present, focus on:
    - Entering data
    - Required fields
    - Submitting
    - Available controls
    - Validation opportunities

32. If buttons are present, focus on the action the user can perform.

33. If displayed information is important to the page functionality,
    include appropriate visibility or correctness checks.

34. If several DOM elements represent the same user flow,
    combine them into one meaningful regression scenario instead
    of generating multiple technical test cases.

35. Prioritize quality and regression value over quantity.

OUTPUT RULES:

Return ONLY valid JSON.

Do not return Markdown.

Do not use code fences.

Do not include explanations before or after the JSON.

Use exactly this JSON structure:

{
  "testCases": [
    {
      "id": "TC_001",
      "name": "Clear test case name",
      "description": "Clear description of what functionality should be verified."
    }
  ]
}

ID RULES:

- Use sequential IDs.
- Start with TC_001.
- Continue with TC_002, TC_003, and so on.
- Do not duplicate IDs.

CLEANED APPLICATION DOM:

${dom}
`;
}