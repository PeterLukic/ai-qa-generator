import { NextResponse } from "next/server";

import { getDetailedPrompt } from "@/lib/prompts/detailedPrompt";
import { getBddPrompt } from "@/lib/prompts/bddPrompt";
import { getChunkAnalysisPrompt } from "@/lib/prompts/chunkAnalysisPrompt";

import {
  ALLOWED_TEST_FOCUS,
  getMaxTestsForFocus,
  getTestFocusInstructions,
  type TestFocus,
} from "@/lib/prompts/testFocus";

type TestCaseFormat =
  | "detailed"
  | "bdd";

type DomChunkPayload = {
  id: string;
  documentIndex: number;
  content: string;
  length: number;
};

type ChunkAnalysis = {
  chunkId?: string;
  module?: string;
  userGoals?: unknown[];
  actions?: unknown[];
  inputs?: unknown[];
  navigation?: unknown[];
  validationEvidence?: unknown[];
  regressionRisks?: unknown[];
  [key: string]: unknown;
};

// =====================================================
// CONFIGURATION
// =====================================================

const LARGE_DOM_THRESHOLD =
  24000;

const MAX_CHUNKS =
  30;

const MAX_CHUNK_LENGTH =
  16000;

const CHUNK_ANALYSIS_MAX_TOKENS =
  1800;

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
    model as (
      typeof ALLOWED_MODELS
    )[number]
  );
}

// =====================================================
// GENERATION PROMPT
// =====================================================

function getGenerationPrompt(
  format: TestCaseFormat,
  sourceContext: string,
  testFocus: TestFocus
): string {
  switch (format) {
    case "detailed":
      return getDetailedPrompt(
        sourceContext,
        testFocus
      );

    case "bdd":
      return getBddPrompt(
        sourceContext,
        testFocus
      );

    default:
      return getDetailedPrompt(
        sourceContext,
        testFocus
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
    // TABLE TEST CASES
    // =================================================

    case "detailed":
      return `
The selected output format is TABLE TEST CASES.

PURPOSE:

Create a concise professional regression suite
that can be displayed as a table and later
exported to Excel.

The final JSON MUST preserve EXACTLY this structure:

{
  "testCases": [
    {
      "id": "TC_001",
      "title": "Clear regression test title",
      "priority": "P1",
      "testSteps": [
        "First tester action",
        "Second tester action"
      ],
      "expectedResult": "Main observable expected result",
      "status": "Not Executed",
      "bugId": ""
    }
  ]
}

TABLE TEST CASE RULES:

- Each test must have ONE clear objective.
- Keep test steps concise.
- Test steps must describe tester/user actions.
- Do not put expected results inside testSteps.
- expectedResult describes the main observable
  outcome of the test.
- Use only P1, P2, or P3 priority.
- status MUST always be "Not Executed".
- bugId MUST always be "".
- Never invent Pass, Fail, Blocked, or defects.

PRIORITY MEANING:

P1 = Core or business-critical regression coverage.
P2 = Important regression coverage.
P3 = Useful but lower-risk regression coverage.

Do NOT generate fields such as:

- description
- preconditions
- inputData
- actualResult
- testEnvironment
- executionStatus
- bugSeverity
- bugPriority
- notes

Those fields are no longer part of the
Table Test Case format.
`;

    // =================================================
    // BDD / GHERKIN
    // =================================================

    case "bdd":
      return `
The selected output format is BDD / GHERKIN.

PURPOSE:

Create concise, business-readable,
automation-friendly behavioral scenarios.

The final JSON MUST preserve EXACTLY this structure:

{
  "feature": "Clear user-facing feature name",
  "scenarios": [
    {
      "id": "BDD_001",
      "name": "Clear business-readable scenario name",
      "tags": [
        "@regression",
        "@positive"
      ],
      "given": [
        "starting condition"
      ],
      "when": [
        "important user action"
      ],
      "then": [
        "observable expected behavior"
      ]
    }
  ]
}

BDD RULES:

- Every scenario MUST contain @regression.
- Add @smoke only when appropriate.
- Add @positive for successful valid behavior.
- Add @negative for invalid/rejected behavior.
- Add @edge for meaningful boundaries.
- Use Given / When / Then correctly.
- Use And only through additional array items.
- Keep scenarios concise.
- Write from the user/business perspective.
- Do not write technical DOM implementation
  inside Gherkin steps.
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
  if (
    format === "bdd"
  ) {
    return Array.isArray(
      data.scenarios
    )
      ? data.scenarios.length
      : 0;
  }

  return Array.isArray(
    data.testCases
  )
    ? data.testCases.length
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
// GROQ
// =====================================================

async function callGroq(
  apiKey: string,
  model: string,
  prompt: string,
  maxCompletionTokens = 8192
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

          reasoning_effort:
            "low",

          include_reasoning:
            false,

          max_completion_tokens:
            maxCompletionTokens,
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

    if (
      response.status === 429
    ) {
      throw new Error(
        "Groq rate limit reached while processing the DOM. Please try again later."
      );
    }

    if (
      response.status === 413
    ) {
      throw new Error(
        "A DOM chunk is still too large for the Groq request."
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
// VALIDATE CHUNKS
// =====================================================

function validateChunks(
  chunks: unknown
): DomChunkPayload[] {

  if (
    !Array.isArray(
      chunks
    )
  ) {
    throw new Error(
      "Large DOM requires semantic DOM chunks."
    );
  }

  if (
    chunks.length === 0
  ) {
    throw new Error(
      "No DOM chunks were provided."
    );
  }

  if (
    chunks.length >
    MAX_CHUNKS
  ) {
    throw new Error(
      `Too many DOM chunks. Maximum supported is ${MAX_CHUNKS}.`
    );
  }

  const validated:
    DomChunkPayload[] = [];

  for (
    const item of chunks
  ) {
    if (
      !item ||
      typeof item !==
      "object"
    ) {
      throw new Error(
        "Invalid DOM chunk."
      );
    }

    const chunk =
      item as Partial<DomChunkPayload>;

    if (
      !chunk.id ||
      typeof chunk.id !==
      "string"
    ) {
      throw new Error(
        "DOM chunk ID is missing."
      );
    }

    if (
      !chunk.content ||
      typeof chunk.content !==
      "string"
    ) {
      throw new Error(
        `DOM chunk ${chunk.id} has no content.`
      );
    }

    if (
      chunk.content.length >
      MAX_CHUNK_LENGTH
    ) {
      throw new Error(
        `DOM chunk ${chunk.id} is too large.`
      );
    }

    validated.push({
      id:
        chunk.id,

      documentIndex:
        typeof chunk.documentIndex ===
        "number"
          ? chunk.documentIndex
          : 1,

      content:
        chunk.content,

      length:
        chunk.content.length,
    });
  }

  return validated;
}

// =====================================================
// ANALYZE CHUNKS
// =====================================================

async function analyzeChunks(
  chunks: DomChunkPayload[],
  apiKey: string,
  model: string
): Promise<ChunkAnalysis[]> {

  const analyses:
    ChunkAnalysis[] = [];

  for (
    let index = 0;
    index < chunks.length;
    index++
  ) {
    const chunk =
      chunks[index];

    console.log(
      `Analyzing DOM chunk ${index + 1}/${chunks.length}:`,
      chunk.id,
      `(${chunk.length} chars)`
    );

    const prompt =
      getChunkAnalysisPrompt(
        chunk.content,
        chunk.id
      );

    const response =
      await callGroq(
        apiKey,
        model,
        prompt,
        CHUNK_ANALYSIS_MAX_TOKENS
      );

    let parsed:
      Record<string, unknown>;

    try {
      parsed =
        parseModelJson(
          response
        );

    } catch {
      console.error(
        `Chunk ${chunk.id} returned invalid JSON.`
      );

      console.error(
        response
      );

      throw new Error(
        `AI analysis failed for DOM chunk ${chunk.id}.`
      );
    }

    analyses.push(
      parsed as ChunkAnalysis
    );
  }

  return analyses;
}

// =====================================================
// BUILD COMPACT QA CONTEXT
// =====================================================

function buildChunkedQaContext(
  analyses: ChunkAnalysis[]
): string {

  return `
=====================================================
PRE-ANALYZED APPLICATION QA EVIDENCE
=====================================================

The original application DOM was too large to send
to the generation model directly.

It was divided into semantic DOM chunks.

Each chunk was independently analyzed by a QA agent.

The JSON below contains QA-relevant evidence extracted
from those chunks.

IMPORTANT:

- Treat this evidence as the source of truth.
- Do not assume functionality not represented here.
- Information may originate from different pages,
  screens, modules, or sections of the application.
- Deduplicate equivalent functionality.
- Prefer user-facing and business-relevant behavior.
- Do not invent missing relationships between modules.
- Do not invent backend behavior.
- Do not invent exact messages.
- Do not invent redirects.
- Do not invent business rules.

CHUNK ANALYSES:

${JSON.stringify(
    analyses,
    null,
    2
  )}
`;
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

      chunks,

      testFocus =
        "critical",

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
    // VALIDATE API KEY
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
    // VALIDATE TEST FOCUS
    // =================================================

    if (
      typeof testFocus !==
      "string" ||
      !ALLOWED_TEST_FOCUS.includes(
        testFocus as TestFocus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Test Focus.",
        },
        {
          status: 400,
        }
      );
    }

    const focus =
      testFocus as TestFocus;

    const maxTests =
      getMaxTestsForFocus(
        focus
      );

    const focusInstructions =
      getTestFocusInstructions(
        focus
      );

    // =================================================
    // CHOOSE PROCESSING MODE
    // =================================================

    const isLargeDom =
      dom.length >
      LARGE_DOM_THRESHOLD;

    let sourceContext =
      dom;

    let processingMode:
      "direct" |
      "chunked" =
        "direct";

    let chunkCount =
      0;

    // =================================================
    // LARGE DOM → CHUNK ANALYSIS
    // =================================================

    if (isLargeDom) {
      processingMode =
        "chunked";

      const validatedChunks =
        validateChunks(
          chunks
        );

      chunkCount =
        validatedChunks.length;

      console.log(
        "Large DOM detected."
      );

      console.log(
        "Original cleaned DOM length:",
        dom.length
      );

      console.log(
        "Semantic chunks:",
        chunkCount
      );

      console.log(
        "Starting chunk QA analysis..."
      );

      // Use the smaller Generator model
      // for map-stage chunk analysis.
      const chunkAnalyses =
        await analyzeChunks(
          validatedChunks,
          apiKey,
          generatorModel
        );

      sourceContext =
        buildChunkedQaContext(
          chunkAnalyses
        );

      console.log(
        "Chunk analysis complete."
      );

      console.log(
        "Merged QA context length:",
        sourceContext.length
      );
    }

    // =================================================
    // LOG CONFIGURATION
    // =================================================

    console.log(
      "Processing mode:",
      processingMode
    );

    console.log(
      "Selected format:",
      format
    );

    console.log(
      "Selected test focus:",
      focus
    );

    console.log(
      "Maximum tests:",
      maxTests
    );

    console.log(
      "Generator model:",
      generatorModel
    );

    console.log(
      "Reviewer model:",
      reviewerModel
    );

    console.log(
      "Source context length:",
      sourceContext.length
    );

    // NEVER log apiKey.

    // =====================================================
    // GENERATOR QA AGENT
    // =====================================================

    console.log(
      "QA Generator is creating regression coverage..."
    );

    const generationPrompt =
      getGenerationPrompt(
        format,
        sourceContext,
        focus
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
    // REVIEWER QA AGENT
    // =====================================================

    console.log(
      "QA Reviewer is reviewing generated regression coverage..."
    );

    const seniorReviewRules =
      getSeniorReviewRules(
        format
      );

    const reviewerPrompt = `
You are an experienced Senior QA Engineer
and QA Automation Strategist.

You are reviewing a regression suite generated
by another AI QA Engineer.

You have:

1. Application QA evidence.
2. The generated QA suite.
3. The selected Test Focus.
4. The required output format.

The application evidence may be either:

- A cleaned DOM for smaller applications.

OR:

- Structured QA evidence extracted from semantic
  DOM chunks for larger applications.

Your responsibility is to produce the FINAL,
high-quality regression suite.

=====================================================
SELECTED TEST FOCUS
=====================================================

${focusInstructions}

=====================================================
MAXIMUM SUITE SIZE
=====================================================

The FINAL suite may contain a MAXIMUM of:

${maxTests}

${format === "bdd"
  ? "BDD scenarios"
  : "Table Test Cases"}

This is a maximum, NOT a target.

If the generated suite contains unnecessary tests,
REMOVE them.

If only 2 or 3 tests provide meaningful regression
protection, return only those tests.

Never keep filler tests simply to reach the maximum.

=====================================================
GENERAL REVIEW RULES
=====================================================

1. Review every generated test case or scenario.

2. Remove duplicate coverage.

3. Remove low-value coverage.

4. Remove cosmetic checks.

5. Remove implementation-detail checks.

6. Remove tests that provide little regression value.

7. Improve unclear test/scenario names.

8. Improve steps when necessary.

9. Improve expected results when necessary.

10. Correct priority or tags when necessary.

11. Remove unsupported assumptions.

12. Do not invent functionality that cannot reasonably
    be determined from the supplied evidence.

13. Do not assume:

    - Backend responses.
    - API responses.
    - Database behavior.
    - Redirect destinations.
    - Exact success messages.
    - Exact error messages.
    - Additional pages.
    - Roles.
    - Permissions.
    - Business rules.

    unless supported by the supplied evidence.

14. Prefer user-facing behavior.

15. Prefer business-critical functionality.

16. Prefer scenarios worth automating and
    maintaining long-term.

17. Keep the final suite concise.

18. Preserve the required JSON structure EXACTLY.

19. Respect the selected Test Focus.

20. Respect the maximum suite size.

21. Never invent filler coverage.

=====================================================
AUTOMATION VALUE
=====================================================

Think like a QA Automation Engineer building
the foundation of a regression framework.

Ask:

"Would this test be valuable enough to automate
and maintain?"

If the answer is no, remove it.

The purpose is NOT maximum test quantity.

The purpose is maximum regression value
with minimum unnecessary maintenance.

=====================================================
APPLICATION EVIDENCE
=====================================================

${sourceContext}

=====================================================
FORMAT RULES
=====================================================

${seniorReviewRules}

=====================================================
GENERATED QA SUITE
=====================================================

${JSON.stringify(
      generatorData,
      null,
      2
    )}

=====================================================
FINAL RESPONSE
=====================================================

Return ONLY valid JSON.

Do not return Markdown.

Do not use code fences.

Do not include explanations before or after JSON.
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
    // FINAL SAFETY CHECK
    // =====================================================

    if (
      reviewerCount >
      maxTests
    ) {
      console.warn(
        `Reviewer returned ${reviewerCount} tests but maximum for "${focus}" is ${maxTests}.`
      );

      if (
        format === "bdd" &&
        Array.isArray(
          reviewerData.scenarios
        )
      ) {
        reviewerData.scenarios =
          reviewerData.scenarios.slice(
            0,
            maxTests
          );
      }

      if (
        format === "detailed" &&
        Array.isArray(
          reviewerData.testCases
        )
      ) {
        reviewerData.testCases =
          reviewerData.testCases.slice(
            0,
            maxTests
          );
      }
    }

    const finalCount =
      getGeneratedCount(
        reviewerData,
        format
      );

    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      format,

      testFocus:
        focus,

      model:
        `${generatorModel} + ${reviewerModel}`,

      workflow: {
        provider:
          "groq",

        processingMode,

        originalDomLength:
          dom.length,

        chunkCount,

        analyzedChunks:
          processingMode ===
          "chunked"
            ? chunkCount
            : 0,

        sourceContextLength:
          sourceContext.length,

        testFocus:
          focus,

        maximumTests:
          maxTests,

        generatorModel,
        reviewerModel,

        generated:
          generatorCount,

        approved:
          finalCount,
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