import { NextResponse } from "next/server";

import {
  getPomPrompt,
  PomFramework,
} from "@/lib/prompts/pomPrompt";

const ALLOWED_MODELS = [
  "gemma4:31b",
  "gpt-oss:20b",
  "gpt-oss:120b",
  "nemotron-3-nano:30b",
  "nemotron-3-super",
  "nemotron-3-ultra",
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
// CALL OLLAMA CLOUD
// =====================================================

async function callOllama(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const response = await fetch(
    "https://ollama.com/api/chat",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
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

        stream: false,
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      `Ollama request failed for ${model}:`,
      response.status,
      errorText
    );

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      throw new Error(
        "Invalid or unauthorized Ollama API key."
      );
    }

    throw new Error(
      `Ollama model "${model}" failed with status ${response.status}.`
    );
  }

  const data =
    await response.json();

  const content =
    data?.message?.content;

  if (
    !content ||
    typeof content !== "string"
  ) {
    throw new Error(
      `Ollama model "${model}" returned an empty response.`
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
    // VALIDATION
    // =================================================

    if (
      !dom ||
      typeof dom !== "string"
    ) {
      return NextResponse.json(
        {
          error: "DOM content is required.",
        },
        {
          status: 400,
        }
      );
    }

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

    const allowedFrameworks:
      PomFramework[] = [
        "playwright",
        "mobilewright",
      ];

    if (
      !allowedFrameworks.includes(framework)
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

    if (
      !apiKey ||
      typeof apiKey !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Ollama API key is required. Configure it in Settings.",
        },
        {
          status: 400,
        }
      );
    }

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
      "Generator:",
      generatorModel
    );

    console.log(
      "Reviewer:",
      reviewerModel
    );

    // Never log API key.

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
      await callOllama(
        apiKey,
        generatorModel,
        generationPrompt
      );

    const generatedCode =
      cleanCode(generatedContent);

    // =====================================================
    // 2. REVIEWER
    // =====================================================

    const reviewerPrompt = `
You are an experienced Senior QA Automation Engineer.

Review the generated Page Object Model below.

Your job is to return the FINAL improved TypeScript Page Object Model.

FRAMEWORK:

${framework}

CLASS NAME:

${className}

REVIEW RULES:

1. Preserve the selected framework.

2. Preserve the class name exactly:
   ${className}

3. Fix invalid TypeScript.

4. Remove duplicate locators.

5. Remove unused locators.

6. Remove unnecessary imports.

7. Improve locator stability.

8. Prefer meaningful user-facing locators.

9. Do not invent selectors that are not supported by the DOM.

10. Do not invent functionality.

11. Avoid fragile selectors.

12. Keep locator names descriptive and camelCase.

13. Keep methods reusable and user-focused.

14. Do not place test assertions in the Page Object.

15. Do not generate tests.

16. Do not generate BDD.

17. Do not generate step definitions.

18. Return ONLY TypeScript source code.

19. Do not return Markdown.

20. Do not use triple backticks.

ORIGINAL DOM:

${dom}

GENERATED PAGE OBJECT:

${generatedCode}
`;

    const reviewedContent =
      await callOllama(
        apiKey,
        reviewerModel,
        reviewerPrompt
      );

    const finalCode =
      cleanCode(reviewedContent);

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
        generatorModel,
        reviewerModel,
      },

      code: finalCode,
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
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}