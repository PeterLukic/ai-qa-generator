import { NextResponse } from "next/server";

import {
  getPomPrompt,
  PomFramework,
} from "@/lib/prompts/pomPrompt";

// =====================================================
// ALLOWED GROQ MODELS
// =====================================================

const ALLOWED_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
] as const;

function isAllowedModel(model: string): boolean {
  return ALLOWED_MODELS.includes(
    model as (typeof ALLOWED_MODELS)[number]
  );
}

// =====================================================
// CLEAN MODEL CODE
// =====================================================

function cleanCode(content: string): string {
  return content
    .trim()
    .replace(/^```typescript\s*/i, "")
    .replace(/^```ts\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

// =====================================================
// CALL GROQ
// =====================================================

async function callGroq(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
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

    if (response.status === 429) {
      throw new Error(
        "Groq rate limit reached. Please wait and try again."
      );
    }

    if (response.status === 413) {
      throw new Error(
        "The uploaded DOM is too large for the Groq request."
      );
    }

    throw new Error(
      `Groq model "${model}" failed with status ${response.status}.`
    );
  }

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
// POST /api/generate-pom
// =====================================================

export async function POST(request: Request) {
  try {
    const body =
      await request.json();

    const {
      dom,
      className,
      framework,
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
    // VALIDATE CLASS NAME
    // =================================================

    if (
      !className ||
      typeof className !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Page Object class name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE FRAMEWORK
    // =================================================

    const allowedFrameworks:
      PomFramework[] = [
        "playwright",
        "mobilewright",
      ];

    if (
      !allowedFrameworks.includes(
        framework
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid POM framework.",
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
      typeof generatorModel !== "string" ||
      !isAllowedModel(generatorModel)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Generator model.",
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
      typeof reviewerModel !== "string" ||
      !isAllowedModel(reviewerModel)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Reviewer model.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Generating POM:",
      className
    );

    console.log(
      "Framework:",
      framework
    );

    console.log(
      "Groq Generator:",
      generatorModel
    );

    console.log(
      "Groq Reviewer:",
      reviewerModel
    );

    console.log(
      "DOM length:",
      dom.length
    );

    // NEVER log API key.

    // =====================================================
    // 1. GENERATOR
    // =====================================================

    const generationPrompt =
      getPomPrompt(
        dom,
        className,
        framework
      );

    const generatedContent =
      await callGroq(
        apiKey,
        generatorModel,
        generationPrompt
      );

    const generatedCode =
      cleanCode(
        generatedContent
      );

    // =====================================================
    // 2. REVIEWER
    // =====================================================

    const reviewerPrompt = `
You are an experienced Senior QA Automation Engineer.

Review the generated Page Object Model below.

Your job is to return the FINAL improved TypeScript
Page Object Model.

=====================================================
FRAMEWORK
=====================================================

${framework}

=====================================================
CLASS NAME
=====================================================

${className}

=====================================================
REVIEW RULES
=====================================================

1. Preserve the selected framework.

2. Preserve the class name exactly:

${className}

3. Fix invalid TypeScript.

4. Remove duplicate locators.

5. Remove unused locators.

6. Remove unnecessary imports.

7. Improve locator stability.

8. Prefer meaningful user-facing locators.

9. Do not invent selectors that are not supported
   by the supplied DOM.

10. Do not invent functionality.

11. Avoid fragile selectors.

12. Keep locator names descriptive and camelCase.

13. Keep methods reusable and user-focused.

14. Action methods must reuse locators already declared
    in the Page Object.

15. Do not recreate selectors inside methods.

16. Important reusable locators MUST remain public readonly.

GOOD:

readonly usernameInput: Locator;

BAD:

private readonly usernameInput: Locator;

BAD:

protected readonly usernameInput: Locator;

17. Public locators may later be used by Step Definitions
    for Playwright assertions.

18. Do not introduce private or protected locators.

19. Do not use #private TypeScript fields.

20. Do not put test assertions inside the Page Object.

21. Do not generate tests.

22. Do not generate BDD scenarios.

23. Do not generate Step Definitions.

24. Do not invent URLs.

25. Return ONLY TypeScript source code.

26. Do not return Markdown.

27. Do not use triple backticks.

=====================================================
FINAL CHECK
=====================================================

Before returning the code verify:

- class name is exactly ${className}
- framework is ${framework}
- important locators are public readonly
- selectors are supported by the DOM
- no duplicate locators exist
- methods reuse declared locators
- no unnecessary assertions exist
- no test code exists
- TypeScript is valid

=====================================================
ORIGINAL DOM
=====================================================

${dom}

=====================================================
GENERATED PAGE OBJECT
=====================================================

${generatedCode}
`;

    const reviewedContent =
      await callGroq(
        apiKey,
        reviewerModel,
        reviewerPrompt
      );

    const finalCode =
      cleanCode(
        reviewedContent
      );

    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      className,

      framework,

      model:
        `${generatorModel} + ${reviewerModel}`,

      workflow: {
        provider:
          "groq",

        generatorModel,
        reviewerModel,
      },

      code:
        finalCode,
    });

  } catch (error) {
    console.error(
      "Generate POM API error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate Page Object Model.";

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