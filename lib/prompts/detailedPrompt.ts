export function getDetailedPrompt(
  dom: string,
  numberOfTests: number
): string {
  return `
You are an experienced Senior QA Engineer creating detailed regression test cases.

Analyze the provided cleaned application DOM and identify what page,
screen, component, or application functionality is represented.

Generate exactly ${numberOfTests} of the most important detailed regression
test cases based ONLY on the provided DOM.

PURPOSE:
Create professional, execution-ready manual regression test cases that
can later be exported directly to Excel.

GENERAL RULES:

1. The prompt is UNIVERSAL.
   The DOM may represent any application page, screen, or component.

2. First understand the functionality represented by the DOM.

3. Focus primarily on:
   - Important user-facing functionality
   - Main user actions
   - Business-critical flows
   - Forms and inputs
   - Buttons and interactive controls
   - Navigation
   - Validation
   - Positive scenarios
   - Negative scenarios
   - Boundary and edge cases when relevant

4. Prioritize functional regression coverage over cosmetic HTML checks.

5. Avoid duplicate or overlapping test cases.

6. Do not invent functionality that is not supported by the DOM.

7. Do not assume specific redirects, messages, backend responses,
   business rules, or other pages unless supported by the DOM.

8. Each test case must test one clear objective.

9. Test Case Name must be short and descriptive.

10. Preconditions must describe only conditions necessary before execution.

11. Test steps must be clear enough for a manual QA tester to execute.

12. Each test step MUST have its own corresponding expected result.

13. Input Data must contain relevant values required for execution.
    If no specific input data is required, use "N/A".

14. Priority must be one of:
    Critical
    High
    Medium
    Low

15. Generate approximately the requested number of cases based on
    meaningful functionality. Never invent functionality just to create
    filler test cases.

EXECUTION FIELDS:

The following fields are intended to be completed later by the tester.

Do NOT invent execution results or defects.

Set:

actualResult = ""
testEnvironment = ""
executionStatus = "Not Executed"
bugSeverity = ""
bugPriority = ""
notes = ""

OUTPUT:

Return ONLY valid JSON.
Do not return Markdown.
Do not use code fences.
Do not include explanations before or after the JSON.

Use exactly this structure:

{
  "testCases": [
    {
      "id": "TC_001",
      "name": "Clear test case name",
      "description": "What functionality or behavior is being verified.",
      "preconditions": [
        "Required precondition"
      ],
      "steps": [
        {
          "step": 1,
          "action": "Action performed by the tester",
          "expectedResult": "Expected result immediately associated with this action"
        },
        {
          "step": 2,
          "action": "Next tester action",
          "expectedResult": "Expected result associated with this action"
        }
      ],
      "inputData": [
        "Relevant test data"
      ],
      "priority": "High",
      "actualResult": "",
      "testEnvironment": "",
      "executionStatus": "Not Executed",
      "bugSeverity": "",
      "bugPriority": "",
      "notes": ""
    }
  ]
}

CLEANED APPLICATION DOM:

${dom}
`;
}