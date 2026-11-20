export type PomFramework =
  | "playwright"
  | "mobilewright";

export function getPomPrompt(
  dom: string,
  className: string,
  framework: PomFramework
): string {
  const frameworkRules =
    framework === "playwright"
      ? `
=====================================================
FRAMEWORK: PLAYWRIGHT TYPESCRIPT
=====================================================

Generate a Playwright TypeScript Page Object Model.

Use:

import { Page, Locator } from "@playwright/test";

The class should follow this general structure:

export class ${className} {
  readonly page: Page;

  readonly exampleInput: Locator;
  readonly primaryButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.exampleInput =
      page.getByPlaceholder("Example");

    this.primaryButton =
      page.getByRole("button", {
        name: "Submit",
      });
  }

  async enterExample(
    value: string
  ): Promise<void> {
    await this.exampleInput.fill(value);
  }

  async clickPrimaryButton(): Promise<void> {
    await this.primaryButton.click();
  }
}

=====================================================
PLAYWRIGHT LOCATOR PRIORITY
=====================================================

Prefer stable Playwright locators.

Use this general priority when supported by the DOM:

1. getByTestId()
2. getByRole()
3. getByLabel()
4. getByPlaceholder()
5. getByText()
6. locator() with a stable CSS selector

Do NOT automatically choose getByTestId() if no test ID
actually exists in the DOM.

Every locator must be supported by the supplied DOM.

Avoid XPath unless absolutely necessary.

Avoid fragile selectors based on:

- generated CSS classes
- deeply nested DOM structure
- nth-child
- nth-of-type
- dynamic IDs
- random framework attributes
- positional selectors

Prefer Playwright-native locators.

=====================================================
PLAYWRIGHT ACTION METHODS
=====================================================

Create useful reusable methods when the DOM supports them.

Examples:

enterSearchTerm()
clickSubmit()
openProfile()
selectCountry()
checkAgreement()
uncheckAgreement()
clickMenu()
submitForm()

Use Playwright interactions such as:

fill()
click()
check()
uncheck()
selectOption()
press()

when appropriate.

Do not create meaningless wrapper methods for every locator.
`
      : `
=====================================================
FRAMEWORK: MOBILEWRIGHT TYPESCRIPT
=====================================================

Generate a Mobilewright TypeScript Page Object Model.

Use:

import { android } from "mobilewright";

type MobileScreen =
  Awaited<ReturnType<typeof android.launch>>["screen"];

The class should follow this general structure:

export class ${className} {
  readonly screen: MobileScreen;

  readonly exampleInput;
  readonly primaryButton;

  constructor(screen: MobileScreen) {
    this.screen = screen;

    this.exampleInput =
      screen.getByTestId("example_input");

    this.primaryButton =
      screen.getByTestId("primary_button");
  }

  async enterExample(
    value: string
  ): Promise<void> {
    await this.exampleInput.fill(value);
  }

  async tapPrimaryButton(): Promise<void> {
    await this.primaryButton.tap();
  }
}

=====================================================
MOBILEWRIGHT LOCATOR PRIORITY
=====================================================

Use locator information actually available in the supplied mobile DOM.

Prefer when supported:

1. getByTestId()
2. getByLabel()
3. getByText()

Do NOT invent:

- resource IDs
- test IDs
- accessibility labels
- visible text
- content descriptions
- Android attributes
- iOS attributes

Every generated locator must be supported by the supplied DOM.

=====================================================
MOBILEWRIGHT ACTION METHODS
=====================================================

Use Mobilewright-compatible interactions when supported,
such as:

tap()
fill()
clear()

Create meaningful reusable methods such as:

enterSearchTerm()
tapSubmitButton()
tapProfileTab()
openMenu()
selectOption()

Do NOT generate Playwright Web-specific code when the
selected framework is Mobilewright.
`;

  return `
You are an experienced Senior QA Automation Engineer.

Your task is to analyze the supplied application DOM and generate
a professional, reusable Page Object Model.

This prompt is UNIVERSAL.

The DOM may represent any application page, screen, component,
or workflow, including:

- Login
- Home
- Dashboard
- Profile
- Settings
- Search
- Forms
- Payments
- Banking
- Transfers
- Checkout
- Administration
- Navigation
- Menus
- Mobile screens
- Web pages
- Any other application functionality

Do NOT assume the application is a login page.

Do NOT assume any specific product, company, domain,
framework structure, or business workflow.

=====================================================
PAGE OBJECT CLASS NAME
=====================================================

The generated class name MUST be exactly:

${className}

Do not rename it.

${frameworkRules}

=====================================================
GENERAL PAGE OBJECT RULES
=====================================================

1. Analyze the DOM carefully before generating code.

2. Understand the user-facing purpose of the page or screen.

3. Generate only locators that are meaningful for automated testing.

Focus primarily on:

- Input fields
- Buttons
- Links
- Tabs
- Menus
- Checkboxes
- Radio buttons
- Dropdowns
- Search controls
- Navigation controls
- Important labels
- Important messages
- Validation messages
- Page or screen titles
- Important images
- User-facing status information
- Business-critical information

4. Do NOT create a locator for every DOM element.

5. Ignore irrelevant implementation elements such as:

- layout wrappers
- decorative containers
- styling-only elements
- SVG internals
- meaningless spans
- framework-generated wrappers
- hidden technical elements
- irrelevant metadata

=====================================================
PUBLIC LOCATOR RULES
=====================================================

6. Important reusable locators MUST be public readonly properties.

GOOD:

readonly usernameField: Locator;
readonly passwordField: Locator;
readonly loginButton: Locator;

BAD:

private readonly usernameField: Locator;

BAD:

protected readonly loginButton: Locator;

7. Do NOT declare important test locators as private or protected.

8. Public readonly locators are required because other automation
layers may need to use them for assertions.

For example, Step Definitions may legitimately use:

await expect(
  pageObject.usernameField
).toBeVisible();

9. Do NOT use TypeScript private fields such as:

#usernameField

10. Do NOT force consumers of the Page Object to bypass
TypeScript access restrictions.

The generated Page Object must never require code such as:

pageObject["usernameField"]

pageObject["usernameField" as keyof typeof pageObject]

as any

11. The Page Object should provide BOTH where useful:

- public readonly locators for assertions
- reusable public methods for actions

Example:

readonly searchInput: Locator;

async enterSearchTerm(
  value: string
): Promise<void> {
  await this.searchInput.fill(value);
}

=====================================================
LOCATOR NAMING
=====================================================

12. Locator names must be:

- descriptive
- camelCase
- based on user-visible purpose
- understandable by another QA Engineer

GOOD:

usernameField
passwordField
loginButton
profileTab
searchInput
submitButton
validationMessage
accountBalance
transferAmountField
beneficiaryDropdown

BAD:

div1
input2
element123
buttonElement
locatorA
fieldX

13. Avoid technical names when a business/user-facing name exists.

=====================================================
LOCATOR ACCURACY
=====================================================

14. Do NOT invent locators.

Every locator must be supported by information in the supplied DOM.

15. Do NOT invent:

- test IDs
- labels
- placeholders
- roles
- text
- CSS selectors
- IDs
- resource IDs
- accessibility labels

16. If the DOM does not provide enough information for a reliable
locator, omit that locator rather than inventing one.

17. Prefer stable selectors over implementation-specific selectors.

18. Avoid duplicate locators representing the same element.

=====================================================
ACTION METHOD RULES
=====================================================

19. Create reusable public methods for meaningful user actions.

Examples:

enterUsername()
enterPassword()
clickSubmit()
openProfile()
selectBeneficiary()
enterTransferAmount()
search()
openMenu()

20. Action methods MUST use locators already declared in the class.

GOOD:

async clickSubmit(): Promise<void> {
  await this.submitButton.click();
}

BAD:

async clickSubmit(): Promise<void> {
  await this.page
    .getByRole("button", { name: "Submit" })
    .click();
}

The locator should be declared once and reused.

21. Do NOT duplicate locator definitions inside methods.

22. Do NOT create methods for actions that are not supported by the DOM.

23. Do NOT create meaningless methods merely to increase code size.

24. Use clear method parameter types.

Example:

async enterAmount(
  amount: string
): Promise<void> {
  await this.amountField.fill(amount);
}

=====================================================
ASSERTION RESPONSIBILITY
=====================================================

25. Do NOT normally put assertions inside the Page Object.

The Page Object should expose locators and actions.

Assertions should normally remain in:

- tests
- step definitions
- assertion/helper layers

For example, expose:

readonly errorMessage: Locator;

instead of creating:

async verifyErrorMessage() {
  expect(...);
}

unless there is a strong architectural reason.

=====================================================
PAGE / SCREEN PROPERTY
=====================================================

26. For Playwright, expose the Page publicly:

readonly page: Page;

27. For Mobilewright, expose the screen publicly when useful:

readonly screen: MobileScreen;

28. Do NOT make page or screen private if doing so prevents
reasonable reuse by the automation layer.

=====================================================
UNIVERSAL DESIGN
=====================================================

29. The generated Page Object must reflect ONLY the supplied DOM.

30. Do not assume:

- Login behavior
- Redirect behavior
- Authentication rules
- Backend responses
- API responses
- Database behavior
- Error messages
- Success messages
- Business rules
- Other pages

unless supported by the supplied DOM.

31. Do not hardcode product-specific behavior that is not present
in the input.

32. Do not invent URLs.

33. Do not invent navigation destinations.

34. Do not invent form submission behavior.

=====================================================
DO NOT GENERATE
=====================================================

35. Do NOT generate test cases.

36. Do NOT generate BDD scenarios.

37. Do NOT generate step definitions.

38. Do NOT generate fixtures.

39. Do NOT generate configuration files.

40. Do NOT generate sample tests.

41. Do NOT generate explanation text.

The output must contain only the requested Page Object TypeScript file.

=====================================================
TYPESCRIPT QUALITY
=====================================================

42. Generate valid TypeScript.

43. Use async / await correctly.

44. Use Promise<void> for action methods where appropriate.

45. Avoid unnecessary comments.

46. Avoid unused imports.

47. Avoid unused locators.

48. Avoid unused class properties.

49. Avoid duplicate methods.

50. Keep formatting clean and professional.

51. Use consistent quotation style.

52. Ensure the generated code should compile once placed
into an appropriate project.

=====================================================
STEP-DEFINITION COMPATIBILITY
=====================================================

53. The Page Object may later be consumed by BDD Step Definitions.

Therefore:

- important locators must be public readonly
- action methods must be public
- method names must be descriptive
- locator names must be descriptive
- private/protected locators should not be used
- selectors must exist only inside the Page Object

54. The Page Object should allow Step Definitions to use:

ACTIONS:

await pageObject.enterValue(value);

await pageObject.clickSubmit();

ASSERTIONS:

await expect(
  pageObject.submitButton
).toBeVisible();

55. Do NOT force Step Definitions to create their own selectors.

56. Do NOT force Step Definitions to bypass private properties.

=====================================================
FINAL QUALITY CHECK
=====================================================

Before returning the result, verify:

- The class name is exactly ${className}.
- The selected framework is respected.
- Important locators are public readonly.
- No important locator is private or protected.
- All locators are supported by the DOM.
- No selector is invented.
- No duplicate locator exists.
- Action methods reuse declared locators.
- No locator is recreated inside methods.
- No unnecessary assertions exist in the Page Object.
- No test code exists.
- No BDD code exists.
- No Step Definition code exists.
- No unused imports exist.
- No unused properties exist.
- TypeScript syntax is valid.
- The output is maintainable.
- The output can later be consumed cleanly by Step Definitions.

=====================================================
OUTPUT RULES
=====================================================

Return ONLY valid TypeScript source code.

Do NOT return Markdown.

Do NOT use triple backticks.

Do NOT include explanations before the code.

Do NOT include explanations after the code.

The generated code must be ready to save directly as:

${className}.ts

=====================================================
APPLICATION DOM
=====================================================

${dom}
`;
}