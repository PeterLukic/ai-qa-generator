import { NextResponse } from "next/server";

import { getSimplePrompt } from "@/lib/prompts/simplePrompt";
import { getDetailedPrompt } from "@/lib/prompts/detailedPrompt";
import { getBddPrompt } from "@/lib/prompts/bddPrompt";

type TestCaseFormat =
  | "simple"
  | "detailed"
  | "bdd";

// =====================================================
// ALLOWED GROQ MODELS
// =====================================================

const ALLOWED_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
] as const;

// =====================================================
// CHECK MODEL
// =====================================================

function isAllowedModel(
  model: string
): boolean {
  return ALLOWED_MODELS.includes(
    model as (typeof ALLOWED_MODELS)[number]
  );
}

// =====================================================
// GENERATION PROMPT
// =====================================================

function getGenerationPrompt(
  format: TestCaseFormat,
  dom: string,
  numberOfTests: number
): string {
  switch (format) {
    case "simple":
      return getSimplePrompt(
        dom,
        numberOfTests
      );

    case "detailed":
      return getDetailedPrompt(
        dom,
        numberOfTests
      );

    case "bdd":
      return getBddPrompt(
        dom,
        numberOfTests
      );

    default:
      return getDetailedPrompt(
        dom,
        numberOfTests
      );
  }
}

// =====================================================
// SENIOR REVIEW FORMAT RULES
// =====================================================

function getSeniorReviewRules(
  format: TestCaseFormat
): string {
  switch (format) {

    // =================================================
    // SIMPLE
    // =================================================

    case "simple":
      return `
The selected output format is SIMPLE TEST CASES.

PURPOSE:

Create a high-level regression checklist describing WHAT
should be tested.

The final JSON MUST contain exactly this structure:

{
  "testCases": [
    {
      "id": "TC_001",
      "name": "Clear test case name",
      "description": "Clear description of what should be verified."
    }
  ]
}

IMPORTANT SIMPLE TEST RULES:

- Focus on user-facing functionality.
- Focus on important regression coverage.
- Do not include detailed test steps.
- Do not include expected results.
- Do not include preconditions.
- Do not include priorities.
- Do not include automation code.

Do NOT generate tests primarily about:

- HTML attributes
- element IDs
- CSS classes
- form action paths
- HTTP methods
- raw URLs
- DOM hierarchy
- selectors
- framework implementation details

Convert technical DOM evidence into meaningful
user-facing regression objectives.
`;

    // =================================================
    // DETAILED
    // =================================================

    case "detailed":
      return `
The selected output format is DETAILED TEST CASES.

PURPOSE:

Create professional manual regression test cases that
can later be exported to Excel.

The final JSON MUST preserve exactly this structure:

{
  "testCases": [
    {
      "id": "TC_001",
      "name": "Test case name",
      "description": "Description",
      "preconditions": [
        "Required precondition"
      ],
      "steps": [
        {
          "step": 1,
          "action": "Tester action",
          "expectedResult": "Expected result for this action"
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

IMPORTANT DETAILED TEST RULES:

- Every test step must have its own expected result.
- Steps must be executable by a manual tester.
- Input data must be relevant to the scenario.
- Priority must be:
  Critical, High, Medium, or Low.

Execution fields MUST NOT be invented.

Set:

actualResult = ""
testEnvironment = ""
executionStatus = "Not Executed"
bugSeverity = ""
bugPriority = ""
notes = ""
`;

    // =================================================
    // BDD
    // =================================================

    case "bdd":
      return `
The selected output format is BDD / GHERKIN.

PURPOSE:

Create user-focused behavioral scenarios using proper
Given / When / Then structure.

The final JSON MUST preserve exactly this structure:

{
  "feature": "Feature name",
  "scenarios": [
    {
      "id": "BDD_001",
      "name": "Scenario name",
      "tags": [
        "@regression",
        "@positive"
      ],
      "given": [
        "starting condition"
      ],
      "when": [
        "user action"
      ],
      "then": [
        "observable expected behavior"
      ]
    }
  ]
}

TAG RULES:

Every scenario MUST contain:

@regression

Add when appropriate:

@smoke
@positive
@negative
@edge

TAG DEFINITIONS:

@smoke
Critical happy-path functionality.

@positive
Successful behavior using valid data.

@negative
Invalid data, rejected behavior, missing information,
or validation scenarios.

@edge
Boundary values, limits, unusual combinations,
or edge conditions.

A scenario may contain multiple tags.

IMPORTANT BDD RULES:

- Use real Given / When / Then behavior.
- Write scenarios from the user's perspective.
- Do not turn BDD into manual test steps.
- Do not focus on HTML implementation details.
- Avoid scenarios about CSS, IDs, form methods,
  internal URLs, DOM structure, or technical selectors.
- Prefer business behavior and user-visible functionality.
`;

    default:
      return "";
  }
}

// =====================================================
// COUNT GENERATED TESTS
// =====================================================

function getGeneratedCount(
  data: Record<string, unknown>,
  format: TestCaseFormat
): number {
  if (format === "bdd") {
    const scenarios =
      data.scenarios;

    return Array.isArray(
      scenarios
    )
      ? scenarios.length
      : 0;
  }

  const testCases =
    data.testCases;

  return Array.isArray(
    testCases
  )
    ? testCases.length
    : 0;
}

// =====================================================
// CLEAN / PARSE MODEL JSON
// =====================================================

function parseModelJson(
  content: string
): Record<string, unknown> {
  let cleaned =
    content.trim();

  cleaned = cleaned
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/,
      ""
    )
    .trim();

  return JSON.parse(
    cleaned
  );
}

// =====================================================
// CALL GROQ
// =====================================================

async function callGroq(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {

  const response =
    await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey.trim()}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model,

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,
        }),
      }
    );

  // =================================================
  // GROQ ERROR
  // =================================================

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      `Groq request failed for ${model}:`,
      response.status,
      errorText
    );

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      throw new Error(
        "Invalid or unauthorized Groq API key."
      );
    }

    if (
      response.status === 429
    ) {
      throw new Error(
        "Groq rate limit reached. Please wait and try again."
      );
    }

    if (
      response.status === 413
    ) {
      throw new Error(
        "The uploaded DOM is too large for the Groq request."
      );
    }

    throw new Error(
      `Groq model "${model}" failed with status ${response.status}.`
    );
  }

  // =================================================
  // GROQ RESPONSE
  // =================================================

  const data =
    await response.json();

  const content =
    data?.choices?.[0]
      ?.message?.content;

  if (
    !content ||
    typeof content !== "string"
  ) {
    throw new Error(
      `Groq model "${model}" returned an empty response.`
    );
  }

  return content;
}

// =====================================================
// POST /api/generate-tc
// =====================================================

export async function POST(
  request: Request
) {
  try {

    // =================================================
    // READ REQUEST
    // =================================================

    const body =
      await request.json();

    const {
      dom,
      numberOfTests = 10,
      testCaseFormat =
        "detailed",

      apiKey,
      generatorModel,
      reviewerModel,
    } = body;

    // =================================================
    // VALIDATE DOM
    // =================================================

    if (
      !dom ||
      typeof dom !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "DOM content is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE GROQ API KEY
    // =================================================

    if (
      !apiKey ||
      typeof apiKey !== "string" ||
      !apiKey.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Groq API key is required. Configure it in Settings.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE GENERATOR MODEL
    // =================================================

    if (
      !generatorModel ||
      typeof generatorModel !==
        "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Generator model is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isAllowedModel(
        generatorModel
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Selected Generator model is not allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE REVIEWER MODEL
    // =================================================

    if (
      !reviewerModel ||
      typeof reviewerModel !==
        "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Reviewer model is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isAllowedModel(
        reviewerModel
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Selected Reviewer model is not allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE FORMAT
    // =================================================

    const allowedFormats:
      TestCaseFormat[] = [
        "simple",
        "detailed",
        "bdd",
      ];

    if (
      !allowedFormats.includes(
        testCaseFormat
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid test case format.",
        },
        {
          status: 400,
        }
      );
    }

    const format =
      testCaseFormat as TestCaseFormat;

    // =================================================
    // VALIDATE NUMBER OF TESTS
    // =================================================

    const requestedTests =
      Number(
        numberOfTests
      );

    if (
      !Number.isInteger(
        requestedTests
      ) ||
      requestedTests < 1 ||
      requestedTests > 50
    ) {
      return NextResponse.json(
        {
          error:
            "Number of test cases must be between 1 and 50.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // LOG CONFIGURATION
    // =================================================

    console.log(
      "Selected format:",
      format
    );

    console.log(
      "Requested tests:",
      requestedTests
    );

    console.log(
      "Groq Generator model:",
      generatorModel
    );

    console.log(
      "Groq Reviewer model:",
      reviewerModel
    );

    console.log(
      "DOM length:",
      dom.length
    );

    // NEVER log apiKey.

    // =====================================================
    // 1. GENERATOR QA AGENT
    // =====================================================

    console.log(
      "QA Generator is creating test cases with Groq..."
    );

    const generationPrompt =
      getGenerationPrompt(
        format,
        dom,
        requestedTests
      );

    const generatorContent =
      await callGroq(
        apiKey,
        generatorModel,
        generationPrompt
      );

    let generatorData:
      Record<string, unknown>;

    try {
      generatorData =
        parseModelJson(
          generatorContent
        );

    } catch {
      console.error(
        "Generator returned invalid JSON."
      );

      console.error(
        generatorContent
      );

      return NextResponse.json(
        {
          error:
            "Generator model returned invalid JSON.",
        },
        {
          status: 500,
        }
      );
    }

    const generatorCount =
      getGeneratedCount(
        generatorData,
        format
      );

    console.log(
      "Generator created:",
      generatorCount,
      format === "bdd"
        ? "scenarios"
        : "test cases"
    );

    // =====================================================
    // 2. REVIEWER QA AGENT
    // =====================================================

    console.log(
      "QA Reviewer is reviewing generated tests with Groq..."
    );

    const seniorReviewRules =
      getSeniorReviewRules(
        format
      );

    const reviewerPrompt = `
You are an experienced Senior QA Engineer.

You are reviewing a regression test suite generated by
another AI QA Engineer.

You have:

1. The original cleaned application DOM.
2. The generated QA suite.
3. The required output format.

Your responsibility is to produce the FINAL,
high-quality regression suite.

GENERAL REVIEW RULES:

1. Review every generated test case or scenario.

2. Remove duplicate coverage.

3. Remove low-value or meaningless tests.

4. Remove tests focused primarily on insignificant
   implementation details.

5. Improve unclear test names.

6. Improve descriptions where applicable.

7. Improve steps where applicable.

8. Improve expected results where applicable.

9. Correct priorities where applicable.

10. Remove unsupported assumptions.

11. Do not invent functionality that cannot reasonably
    be determined from the provided DOM.

12. Do not assume:
    - backend responses
    - redirects
    - success messages
    - error messages
    - validation messages
    - additional pages
    - database behavior
    - business rules

    unless supported by the provided DOM.

13. Prefer user-facing and business-critical functionality.

14. Include positive coverage where appropriate.

15. Include negative coverage where appropriate.

16. Include meaningful edge cases when supported
    by the DOM.

17. Keep the final suite concise and useful.

18. Preserve the required JSON structure exactly.

19. Target approximately ${requestedTests}
    final tests or scenarios.

20. Never invent filler tests merely to reach
    the requested number.

21. The DOM is evidence of available functionality.
    Convert technical DOM information into meaningful
    user-focused QA coverage.

${seniorReviewRules}

Return ONLY valid JSON.

Do not return Markdown.

Do not use code fences.

Do not include explanations before or after the JSON.

ORIGINAL CLEANED APPLICATION DOM:

${dom}

GENERATED QA SUITE:

${JSON.stringify(
  generatorData,
  null,
  2
)}
`;

    const reviewerContent =
      await callGroq(
        apiKey,
        reviewerModel,
        reviewerPrompt
      );

    let reviewerData:
      Record<string, unknown>;

    try {
      reviewerData =
        parseModelJson(
          reviewerContent
        );

    } catch {
      console.error(
        "Reviewer returned invalid JSON."
      );

      console.error(
        reviewerContent
      );

      return NextResponse.json(
        {
          error:
            "Reviewer model returned invalid JSON.",
        },
        {
          status: 500,
        }
      );
    }

    const reviewerCount =
      getGeneratedCount(
        reviewerData,
        format
      );

    console.log(
      "Reviewer approved:",
      reviewerCount,
      format === "bdd"
        ? "scenarios"
        : "test cases"
    );

    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      format,

      model:
        `${generatorModel} + ${reviewerModel}`,

      workflow: {
        provider:
          "groq",

        generatorModel,
        reviewerModel,

        generated:
          generatorCount,

        approved:
          reviewerCount,
      },

      ...reviewerData,
    });

  } catch (error) {

    console.error(
      "Generate TC API error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate regression test cases.";

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      }
    );
  }
}