import {
  NextResponse,
} from "next/server";

import {
  getPomPrompt,
  getPomReviewerPrompt,
} from "@/lib/prompts/pomPrompt";

import {
  getPomFileExtension,
  getPomStackLabel,
  isSupportedPomStack,
  type PomFramework,
  type PomLanguage,
} from "@/lib/pomConfig";

// =====================================================
// ALLOWED GROQ MODELS
// =====================================================

const ALLOWED_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
] as const;

function isAllowedModel(
  model: string
): boolean {
  return ALLOWED_MODELS.includes(
    model as (
      typeof ALLOWED_MODELS
    )[number]
  );
}

// =====================================================
// VALID LANGUAGE
// =====================================================

function isPomLanguage(
  value: unknown
): value is PomLanguage {
  return [
    "typescript",
    "javascript",
    "python",
    "java",
    "csharp",
  ].includes(
    value as string
  );
}

// =====================================================
// VALID FRAMEWORK
// =====================================================

function isPomFramework(
  value: unknown
): value is PomFramework {
  return [
    "playwright",
    "selenium",
    "webdriverio",
    "cypress",
    "mobilewright",
  ].includes(
    value as string
  );
}

// =====================================================
// CLEAN MODEL CODE
// =====================================================

function cleanCode(
  content: string
): string {
  return content
    .trim()
    .replace(
      /^```(?:typescript|ts|javascript|js|python|py|java|csharp|cs|c#)?\s*/i,
      ""
    )
    .replace(
      /\s*```$/,
      ""
    )
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
  const response =
    await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey.trim()}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            model,

            messages: [
              {
                role:
                  "user",

                content:
                  prompt,
              },
            ],

            temperature:
              0.2,

            reasoning_effort:
              "low",

            include_reasoning:
              false,

            max_completion_tokens:
              8192,
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
      response.status ===
        401 ||
      response.status ===
        403
    ) {
      throw new Error(
        "Invalid or unauthorized Groq API key."
      );
    }

    if (
      response.status ===
      429
    ) {
      throw new Error(
        "Groq rate limit reached. Please wait and try again."
      );
    }

    if (
      response.status ===
      413
    ) {
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
    typeof content !==
      "string"
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

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      dom,
      className,
      language,
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
      typeof dom !==
        "string"
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
      typeof className !==
        "string" ||
      !className.trim()
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
    // VALIDATE LANGUAGE
    // =================================================

    if (
      !isPomLanguage(
        language
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid programming language.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE FRAMEWORK
    // =================================================

    if (
      !isPomFramework(
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
    // VALIDATE STACK
    // =================================================

    if (
      !isSupportedPomStack(
        language,
        framework
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The selected language and framework combination is not supported.",
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
      typeof apiKey !==
        "string" ||
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
    // VALIDATE GENERATOR
    // =================================================

    if (
      !generatorModel ||
      typeof generatorModel !==
        "string" ||
      !isAllowedModel(
        generatorModel
      )
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
    // VALIDATE REVIEWER
    // =================================================

    if (
      !reviewerModel ||
      typeof reviewerModel !==
        "string" ||
      !isAllowedModel(
        reviewerModel
      )
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

    const safeClassName =
      className.trim();

    const stackLabel =
      getPomStackLabel(
        language,
        framework
      );

    const fileExtension =
      getPomFileExtension(
        language
      );

    console.log(
      "Generating POM:",
      safeClassName
    );

    console.log(
      "Language:",
      language
    );

    console.log(
      "Framework:",
      framework
    );

    console.log(
      "Stack:",
      stackLabel
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
        safeClassName,
        language,
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

    const reviewerPrompt =
      getPomReviewerPrompt(
        dom,
        generatedCode,
        safeClassName,
        language,
        framework
      );

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
      success:
        true,

      className:
        safeClassName,

      language,

      framework,

      stackLabel,

      fileExtension,

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
        status:
          500,
      }
    );
  }
}