import { NextResponse } from "next/server";

import { getStepsPrompt } from "@/lib/prompts/stepsPrompt";

// =====================================================
// ALLOWED GROQ MODELS
// =====================================================

const ALLOWED_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
] as const;

// =====================================================
// MODEL VALIDATION
// =====================================================

function isAllowedModel(model: string): boolean {
  return ALLOWED_MODELS.includes(
    model as (typeof ALLOWED_MODELS)[number]
  );
}

// =====================================================
// CLEAN TYPESCRIPT RESPONSE
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
        "The supplied Feature or POM is too large for the Groq request."
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
// POST /api/generate-steps
// =====================================================

export async function POST(request: Request) {
  try {
    const body =
      await request.json();

    const {
      featureContent,
      pomContent,
      apiKey,
      generatorModel,
      reviewerModel,
    } = body;

    // =================================================
    // VALIDATE FEATURE
    // =================================================

    if (
      !featureContent ||
      typeof featureContent !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "BDD feature content is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE POM
    // =================================================

    if (
      !pomContent ||
      typeof pomContent !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Page Object Model content is required.",
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
      "Generating BDD step definitions..."
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
      "Feature length:",
      featureContent.length
    );

    console.log(
      "POM length:",
      pomContent.length
    );

    // NEVER log apiKey.

    // =====================================================
    // 1. GENERATOR
    // =====================================================

    const generationPrompt =
      getStepsPrompt(
        featureContent,
        pomContent
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
You are an experienced Senior QA Automation Engineer
specializing in:

- TypeScript
- Playwright
- playwright-bdd
- Cucumber / Gherkin
- Page Object Model

You are reviewing AI-generated BDD step definitions.

You have:

1. The original BDD feature.
2. The original Page Object Model.
3. Generated TypeScript step definitions.

Your task is to return the FINAL corrected
TypeScript step-definition file.

Accuracy is more important than making every
step appear fully implemented.

=====================================================
UNIVERSAL RULES
=====================================================

1. The solution must remain UNIVERSAL.

2. Do NOT assume the application is OrangeHRM.

3. Do NOT assume the application is a login page.

4. Do NOT add product-specific logic unless it exists
   in the supplied Feature or POM.

5. Use only information supported by the supplied inputs.

=====================================================
BDD COVERAGE
=====================================================

6. Every unique Given / When / Then behavior in the
   supplied feature should have one appropriate definition.

7. Do NOT generate the exact same step expression twice.

8. Preserve parameterized steps.

Example:

When the user enters "Admin"

should use a parameter such as:

When(
  'the user enters {string}',
  async ({ page }, value: string) => {
    ...
  }
);

9. Do not add Gherkin step variations that do not exist
   in the supplied feature.

=====================================================
STRICT POM USAGE
=====================================================

10. The supplied Page Object Model is the ONLY allowed
    source of application locators.

11. Prefer existing public POM methods for actions.

GOOD:

await pageObject.fillUsername(username);

BAD:

await page.getByPlaceholder("Username").fill(username);

12. Public readonly POM locators may be used directly
    for assertions.

GOOD:

await expect(
  pageObject.usernameInput
).toBeVisible();

13. Do NOT create new application selectors inside
    step definitions.

The following are forbidden unless the exact operation
is unrelated to an application element:

page.locator(...)
page.getByRole(...)
page.getByLabel(...)
page.getByPlaceholder(...)
page.getByText(...)
page.getByTestId(...)
page.$(...)
page.$$(...)
XPath
CSS selectors

14. Do NOT duplicate selector logic already inside the POM.

15. Use actual method names and property names from the
    supplied POM exactly.

16. Do NOT invent POM methods.

17. Do NOT invent POM locators.

=====================================================
ACCESS MODIFIER RULES
=====================================================

18. Respect TypeScript access modifiers.

19. NEVER access private or protected properties.

FORBIDDEN:

pageObject["usernameField"]

pageObject["usernameField" as keyof typeof pageObject]

as any

unknown as ...

or any casting trick used to bypass access protection.

20. If required functionality exists only as a private
    property with no public method, use a TODO.

Example:

// TODO: Expose the required locator publicly or add a
// public Page Object method for this behavior.

=====================================================
MISSING FUNCTIONALITY
=====================================================

21. If the Feature requires behavior that the POM
    cannot support, use a clear TODO.

GOOD:

// TODO: Add forgotPasswordLink locator to PageExample.

BAD:

await page.getByText("Forgot password").click();

22. Never invent an implementation just to avoid a TODO.

=====================================================
URL RULES
=====================================================

23. NEVER invent a URL.

24. The following are forbidden unless explicitly present
    in the supplied Feature or POM:

https://example.com
http://example.com
https://localhost
http://localhost

or any guessed application URL.

25. NEVER place an invented URL inside a TODO example either.

BAD:

// TODO: page.goto("https://example.com/login")

GOOD:

// TODO: Add the real navigation URL or a navigation
// method to the Page Object.

26. Use page.goto() only when the exact URL is explicitly
    available in the supplied inputs.

27. If navigation information is missing, leave a TODO.

=====================================================
DESCRIPTIVE STEP RULES
=====================================================

28. Do NOT invent browser actions for descriptive steps.

For example:

"When the login page is rendered"

must NOT automatically become:

await page.waitForLoadState("load");

29. Do NOT add these merely to make a step contain code:

waitForLoadState()
waitForTimeout()
page.evaluate()
window.scrollTo()
reload()
keyboard actions
mouse actions

unless that behavior is genuinely required by the
Feature AND supported by the inputs.

30. If a step is descriptive and no action is needed,
an intentionally empty implementation is acceptable.

=====================================================
ASSERTION RULES
=====================================================

31. Then steps may use Playwright expect().

32. Assertions against application elements must use
    public POM locators.

33. page.title() may be used when the Feature explicitly
    requires page-title verification.

34. If the POM does not expose the required application
    element, use TODO rather than inventing a locator.

=====================================================
PAGE OBJECT INSTANTIATION
=====================================================

35. Detect the actual exported POM class name from
    the supplied Page Object.

36. Do NOT assume it is PageLogin.

37. Inspect the actual constructor.

38. If a POM instance is explicitly supplied through
    fixtures, reuse it.

39. Do NOT invent fixture names unless explicitly
    supported by the inputs.

=====================================================
IMPORT RULES
=====================================================

40. Use:

import { createBdd } from "playwright-bdd";

41. Use the project test fixture from:

import { test } from "../support/fixtures";

when the exact fixture path cannot be determined.

42. Do NOT assume that ../support/fixtures exports:

Page
Locator
Browser
BrowserContext

43. Import Playwright types from @playwright/test
when needed.

44. If expect is not used, do not import expect.

45. If Page is not used as a TypeScript type,
    do not import Page.

46. Remove unused imports.

47. Import the actual supplied POM class.

48. If the exact Page Object path cannot be inferred,
    use a simple adaptable relative path based on
    the class name.

=====================================================
NO UNSAFE TYPES
=====================================================

49. Avoid:

any
unknown casts
keyof hacks

unless absolutely unavoidable for legitimate
TypeScript reasons.

50. Never use unsafe types merely to bypass
    a POM design issue.

=====================================================
STEP IMPLEMENTATION QUALITY
=====================================================

51. Keep implementations concise.

52. Use async / await correctly.

53. Prefer POM action methods.

54. Avoid duplicate automation logic.

55. Do not modify the POM.

56. Do not generate a new POM.

57. Do not regenerate the feature.

58. Do not generate test cases.

59. Do not add unnecessary comments.

=====================================================
FINAL REVIEW CHECKLIST
=====================================================

Before returning the code, verify ALL of the following:

- No invented URLs exist.
- No example.com placeholder exists.
- No direct application selector bypasses the POM.
- No page.getBy... application locator was added.
- No page.locator() application locator was added.
- No XPath was added.
- No CSS selector was invented.
- No private POM property is accessed.
- No "as any" hack exists.
- No keyof hack exists.
- Existing POM methods are reused.
- Existing public locators are reused for assertions.
- Missing functionality uses TODO.
- TODOs do not contain invented URLs.
- No unnecessary waitForLoadState exists.
- No unnecessary waitForTimeout exists.
- No unnecessary page.evaluate exists.
- No fake scrolling behavior exists.
- No duplicate step expressions exist.
- No invented fixture names exist.
- Page / Locator types are not imported from the fixture file.
- No unused imports exist.
- TypeScript is valid.
- playwright-bdd syntax is valid.

If generated code violates any rule above,
correct it before returning the final result.

=====================================================
OUTPUT
=====================================================

Return ONLY valid TypeScript source code.

Do NOT return Markdown.

Do NOT use triple backticks.

Do NOT include explanation text before the code.

Do NOT include explanation text after the code.

=====================================================
ORIGINAL BDD FEATURE
=====================================================

${featureContent}

=====================================================
ORIGINAL PAGE OBJECT MODEL
=====================================================

${pomContent}

=====================================================
GENERATED STEP DEFINITIONS TO REVIEW
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

      model:
        `${generatorModel} + ${reviewerModel}`,

      workflow: {
        provider: "groq",
        generatorModel,
        reviewerModel,
      },

      code:
        finalCode,
    });

  } catch (error) {
    console.error(
      "Generate Steps API error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate step definitions.";

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