import {
  getPomStackLabel,
  type PomFramework,
  type PomLanguage,
} from "@/lib/pomConfig";

function getStackRules(
  language: PomLanguage,
  framework: PomFramework,
  className: string
): string {
  const stack =
    `${language}:${framework}`;

  switch (stack) {
    // =====================================================
    // PLAYWRIGHT TYPESCRIPT
    // =====================================================

    case "typescript:playwright":
      return `
=====================================================
STACK: PLAYWRIGHT + TYPESCRIPT
=====================================================

Use:

import { Page, Locator } from "@playwright/test";

Generate a TypeScript class exactly named:

${className}

Preferred structure:

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

LOCATOR PRIORITY WHEN SUPPORTED BY THE DOM:

1. getByTestId()
2. getByRole()
3. getByLabel()
4. getByPlaceholder()
5. getByText()
6. locator() with stable CSS

Important reusable locators MUST be public readonly.

Do not use private or protected locators.
`;

    // =====================================================
    // PLAYWRIGHT JAVASCRIPT
    // =====================================================

    case "javascript:playwright":
      return `
=====================================================
STACK: PLAYWRIGHT + JAVASCRIPT
=====================================================

Generate modern JavaScript.

Use an exported class exactly named:

${className}

Preferred structure:

export class ${className} {
  constructor(page) {
    this.page = page;

    this.exampleInput =
      page.getByPlaceholder("Example");

    this.primaryButton =
      page.getByRole("button", {
        name: "Submit",
      });
  }

  async enterExample(value) {
    await this.exampleInput.fill(value);
  }

  async clickPrimaryButton() {
    await this.primaryButton.click();
  }
}

LOCATOR PRIORITY WHEN SUPPORTED BY THE DOM:

1. getByTestId()
2. getByRole()
3. getByLabel()
4. getByPlaceholder()
5. getByText()
6. locator() with stable CSS

Keep reusable locators publicly accessible.

Do not use TypeScript syntax.
`;

    // =====================================================
    // PLAYWRIGHT PYTHON
    // =====================================================

    case "python:playwright":
      return `
=====================================================
STACK: PLAYWRIGHT + PYTHON
=====================================================

Use the Playwright Python synchronous API.

Use:

from playwright.sync_api import Page, Locator

Generate a Python class exactly named:

${className}

Preferred structure:

class ${className}:
    def __init__(
        self,
        page: Page
    ) -> None:
        self.page = page

        self.example_input = (
            page.get_by_placeholder(
                "Example"
            )
        )

        self.primary_button = (
            page.get_by_role(
                "button",
                name="Submit"
            )
        )

    def enter_example(
        self,
        value: str
    ) -> None:
        self.example_input.fill(
            value
        )

    def click_primary_button(
        self
    ) -> None:
        self.primary_button.click()

LOCATOR PRIORITY WHEN SUPPORTED BY THE DOM:

1. get_by_test_id()
2. get_by_role()
3. get_by_label()
4. get_by_placeholder()
5. get_by_text()
6. locator() with stable CSS

Use public instance attributes for reusable locators.

Use Python snake_case for locator and method names.
`;

    // =====================================================
    // PLAYWRIGHT JAVA
    // =====================================================

    case "java:playwright":
      return `
=====================================================
STACK: PLAYWRIGHT + JAVA
=====================================================

Use:

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

Generate a public Java class exactly named:

${className}

Preferred structure:

public class ${className} {
    private final Page page;

    public final Locator exampleInput;
    public final Locator primaryButton;

    public ${className}(
        Page page
    ) {
        this.page = page;

        this.exampleInput =
            page.getByPlaceholder(
                "Example"
            );

        this.primaryButton =
            page.getByRole(
                AriaRole.BUTTON,
                new Page.GetByRoleOptions()
                    .setName("Submit")
            );
    }

    public void enterExample(
        String value
    ) {
        exampleInput.fill(
            value
        );
    }

    public void clickPrimaryButton() {
        primaryButton.click();
    }
}

Add any Playwright Java imports actually required by generated code.

Important reusable Locators should be public final.

Do not generate JavaScript or TypeScript syntax.
`;

    // =====================================================
    // PLAYWRIGHT C#
    // =====================================================

    case "csharp:playwright":
      return `
=====================================================
STACK: PLAYWRIGHT + C#
=====================================================

Use:

using Microsoft.Playwright;

Generate a public C# class exactly named:

${className}

Preferred structure:

public class ${className}
{
    public IPage Page { get; }

    public ILocator ExampleInput { get; }
    public ILocator PrimaryButton { get; }

    public ${className}(
        IPage page
    )
    {
        Page = page;

        ExampleInput =
            page.GetByPlaceholder(
                "Example"
            );

        PrimaryButton =
            page.GetByRole(
                AriaRole.Button,
                new()
                {
                    Name = "Submit"
                }
            );
    }

    public async Task EnterExampleAsync(
        string value
    )
    {
        await ExampleInput.FillAsync(
            value
        );
    }

    public async Task ClickPrimaryButtonAsync()
    {
        await PrimaryButton.ClickAsync();
    }
}

Use async Task methods where appropriate.

Important reusable ILocator properties should be public.

Do not generate TypeScript syntax.
`;

    // =====================================================
    // SELENIUM TYPESCRIPT
    // =====================================================

    case "typescript:selenium":
      return `
=====================================================
STACK: SELENIUM + TYPESCRIPT
=====================================================

Use:

import {
  By,
  WebDriver,
} from "selenium-webdriver";

Generate a TypeScript class exactly named:

${className}

Preferred structure:

export class ${className} {
  readonly driver: WebDriver;

  readonly exampleInput =
    By.name("example");

  readonly primaryButton =
    By.css(
      'button[type="submit"]'
    );

  constructor(
    driver: WebDriver
  ) {
    this.driver =
      driver;
  }

  async enterExample(
    value: string
  ): Promise<void> {
    await this.driver
      .findElement(
        this.exampleInput
      )
      .sendKeys(
        value
      );
  }
}

Use stable Selenium By locators.

Preferred locator strategies when supported:

1. By.id()
2. By.name()
3. stable data/test attributes
4. By.css()
5. By.xpath() only when necessary

Important selector definitions must be reusable readonly properties.
`;

    // =====================================================
    // SELENIUM JAVASCRIPT
    // =====================================================

    case "javascript:selenium":
      return `
=====================================================
STACK: SELENIUM + JAVASCRIPT
=====================================================

Use modern JavaScript with selenium-webdriver.

Use:

import {
  By,
} from "selenium-webdriver";

Generate an exported class exactly named:

${className}

Preferred structure:

export class ${className} {
  constructor(driver) {
    this.driver =
      driver;

    this.exampleInput =
      By.name(
        "example"
      );

    this.primaryButton =
      By.css(
        'button[type="submit"]'
      );
  }

  async enterExample(value) {
    await this.driver
      .findElement(
        this.exampleInput
      )
      .sendKeys(
        value
      );
  }
}

Do not generate TypeScript types.

Use stable Selenium selectors supported by the DOM.
`;

    // =====================================================
    // SELENIUM PYTHON
    // =====================================================

    case "python:selenium":
      return `
=====================================================
STACK: SELENIUM + PYTHON
=====================================================

Use:

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

Generate a Python class exactly named:

${className}

Preferred structure:

class ${className}:
    def __init__(
        self,
        driver: WebDriver
    ) -> None:
        self.driver = driver

        self.example_input = (
            By.NAME,
            "example"
        )

        self.primary_button = (
            By.CSS_SELECTOR,
            'button[type="submit"]'
        )

    def enter_example(
        self,
        value: str
    ) -> None:
        self.driver.find_element(
            *self.example_input
        ).send_keys(
            value
        )

Use public reusable locator tuples.

Prefer:

1. ID
2. NAME
3. stable CSS
4. XPath only when necessary

Use Python snake_case.
`;

    // =====================================================
    // SELENIUM JAVA
    // =====================================================

    case "java:selenium":
      return `
=====================================================
STACK: SELENIUM + JAVA
=====================================================

Use:

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

Generate a public Java class exactly named:

${className}

Preferred structure:

public class ${className} {
    private final WebDriver driver;

    public final By exampleInput =
        By.name(
            "example"
        );

    public final By primaryButton =
        By.cssSelector(
            "button[type='submit']"
        );

    public ${className}(
        WebDriver driver
    ) {
        this.driver =
            driver;
    }

    public void enterExample(
        String value
    ) {
        driver
            .findElement(
                exampleInput
            )
            .sendKeys(
                value
            );
    }
}

Important selector definitions should be public final By values.

Prefer stable ID, name and CSS selectors.

Use XPath only when necessary.
`;

    // =====================================================
    // SELENIUM C#
    // =====================================================

    case "csharp:selenium":
      return `
=====================================================
STACK: SELENIUM + C#
=====================================================

Use:

using OpenQA.Selenium;

Generate a public C# class exactly named:

${className}

Preferred structure:

public class ${className}
{
    private readonly IWebDriver _driver;

    public By ExampleInput { get; } =
        By.Name(
            "example"
        );

    public By PrimaryButton { get; } =
        By.CssSelector(
            "button[type='submit']"
        );

    public ${className}(
        IWebDriver driver
    )
    {
        _driver =
            driver;
    }

    public void EnterExample(
        string value
    )
    {
        _driver
            .FindElement(
                ExampleInput
            )
            .SendKeys(
                value
            );
    }
}

Important selector definitions should be public By properties.

Prefer ID, Name and stable CSS selectors.

Use XPath only when necessary.
`;

    // =====================================================
    // WEBDRIVERIO TYPESCRIPT
    // =====================================================

    case "typescript:webdriverio":
      return `
=====================================================
STACK: WEBDRIVERIO + TYPESCRIPT
=====================================================

Generate a WebdriverIO TypeScript Page Object.

Generate a class exactly named:

${className}

Preferred structure:

export class ${className} {
  get exampleInput() {
    return $(
      '[name="example"]'
    );
  }

  get primaryButton() {
    return $(
      'button[type="submit"]'
    );
  }

  async enterExample(
    value: string
  ): Promise<void> {
    await this.exampleInput
      .setValue(
        value
      );
  }

  async clickPrimaryButton(): Promise<void> {
    await this.primaryButton
      .click();
  }
}

Use public selector getters.

Methods must reuse those getters.

Do not recreate selectors inside methods.

Do not invent selector attributes.
`;

    // =====================================================
    // WEBDRIVERIO JAVASCRIPT
    // =====================================================

    case "javascript:webdriverio":
      return `
=====================================================
STACK: WEBDRIVERIO + JAVASCRIPT
=====================================================

Generate a WebdriverIO JavaScript Page Object.

Generate an exported class exactly named:

${className}

Preferred structure:

export class ${className} {
  get exampleInput() {
    return $(
      '[name="example"]'
    );
  }

  get primaryButton() {
    return $(
      'button[type="submit"]'
    );
  }

  async enterExample(value) {
    await this.exampleInput
      .setValue(
        value
      );
  }

  async clickPrimaryButton() {
    await this.primaryButton
      .click();
  }
}

Use public selector getters.

Do not use TypeScript syntax.
`;

    // =====================================================
    // CYPRESS TYPESCRIPT
    // =====================================================

    case "typescript:cypress":
      return `
=====================================================
STACK: CYPRESS + TYPESCRIPT
=====================================================

Generate a Cypress TypeScript Page Object.

Generate an exported class exactly named:

${className}

Preferred structure:

export class ${className} {
  get exampleInput() {
    return cy.get(
      '[name="example"]'
    );
  }

  get primaryButton() {
    return cy.get(
      'button[type="submit"]'
    );
  }

  enterExample(
    value: string
  ): void {
    this.exampleInput
      .clear()
      .type(
        value
      );
  }

  clickPrimaryButton(): void {
    this.primaryButton
      .click();
  }
}

Selectors must exist only in the Page Object getters.

Methods must reuse those getters.

Do not put assertions inside the Page Object.
`;

    // =====================================================
    // CYPRESS JAVASCRIPT
    // =====================================================

    case "javascript:cypress":
      return `
=====================================================
STACK: CYPRESS + JAVASCRIPT
=====================================================

Generate a Cypress JavaScript Page Object.

Generate an exported class exactly named:

${className}

Preferred structure:

export class ${className} {
  get exampleInput() {
    return cy.get(
      '[name="example"]'
    );
  }

  get primaryButton() {
    return cy.get(
      'button[type="submit"]'
    );
  }

  enterExample(value) {
    this.exampleInput
      .clear()
      .type(
        value
      );
  }

  clickPrimaryButton() {
    this.primaryButton
      .click();
  }
}

Do not use TypeScript syntax.

Do not put assertions inside the Page Object.
`;

    // =====================================================
    // MOBILEWRIGHT TYPESCRIPT
    // =====================================================

    case "typescript:mobilewright":
      return `
=====================================================
STACK: MOBILEWRIGHT + TYPESCRIPT
=====================================================

Use:

import { android } from "mobilewright";

type MobileScreen =
  Awaited<
    ReturnType<
      typeof android.launch
    >
  >["screen"];

Generate a TypeScript class exactly named:

${className}

Preferred structure:

export class ${className} {
  readonly screen:
    MobileScreen;

  readonly exampleInput;
  readonly primaryButton;

  constructor(
    screen:
      MobileScreen
  ) {
    this.screen =
      screen;

    this.exampleInput =
      screen.getByTestId(
        "example_input"
      );

    this.primaryButton =
      screen.getByTestId(
        "primary_button"
      );
  }

  async enterExample(
    value: string
  ): Promise<void> {
    await this.exampleInput
      .fill(
        value
      );
  }

  async tapPrimaryButton(): Promise<void> {
    await this.primaryButton
      .tap();
  }
}

Use only locator information actually present in the supplied mobile DOM.

Do not invent resource IDs, test IDs,
accessibility labels, visible text,
content descriptions or platform attributes.

Do not generate Playwright Web code.
`;

    default:
      throw new Error(
        `Unsupported POM stack: ${language} + ${framework}`
      );
  }
}

function getLanguageQualityRules(
  language: PomLanguage
): string {
  switch (language) {
    case "typescript":
      return `
- Generate valid TypeScript.
- Use explicit useful types.
- Use async/await correctly.
- Use Promise<void> where appropriate.
- Do not use any unless genuinely unavoidable.
`;

    case "javascript":
      return `
- Generate valid modern JavaScript.
- Do not generate TypeScript type annotations.
- Use async/await correctly where required.
`;

    case "python":
      return `
- Generate valid Python.
- Follow normal Python naming conventions.
- Use type hints where useful.
- Use snake_case for methods and attributes.
`;

    case "java":
      return `
- Generate valid Java.
- Use appropriate imports.
- Use camelCase for methods and fields.
- Use PascalCase for the class name exactly as supplied.
`;

    case "csharp":
      return `
- Generate valid C#.
- Use appropriate using statements.
- Use PascalCase for public members and methods.
- Use async Task methods where the framework API is asynchronous.
`;

    default:
      return "";
  }
}

export function getPomPrompt(
  dom: string,
  className: string,
  language: PomLanguage,
  framework: PomFramework
): string {
  const stackLabel =
    getPomStackLabel(
      language,
      framework
    );

  const stackRules =
    getStackRules(
      language,
      framework,
      className
    );

  const languageRules =
    getLanguageQualityRules(
      language
    );

  return `
You are an experienced Senior QA Automation Engineer.

Your task is to analyze the supplied application DOM and generate
one professional, reusable Page Object Model.

=====================================================
SELECTED STACK
=====================================================

${stackLabel}

=====================================================
CLASS NAME
=====================================================

The generated Page Object class name MUST be exactly:

${className}

Do not rename it.

${stackRules}

=====================================================
UNIVERSAL PAGE OBJECT RULES
=====================================================

1. Analyze the DOM carefully before generating code.

2. Understand the user-facing purpose of the supplied page,
screen, component or module.

3. Generate only automation elements that are meaningful
for testing.

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
- Important status information
- Business-critical information

4. Do NOT create a locator for every DOM element.

5. Ignore irrelevant implementation elements:

- layout wrappers
- styling-only containers
- decorative elements
- SVG internals
- meaningless spans
- framework-generated wrappers
- dynamic framework attributes
- hidden technical elements
- irrelevant metadata

=====================================================
DOM IS THE SOURCE OF TRUTH
=====================================================

6. Every selector or locator MUST be supported
by information in the supplied DOM.

7. Do NOT invent:

- test IDs
- IDs
- names
- labels
- placeholders
- roles
- text
- CSS selectors
- XPath values
- resource IDs
- accessibility labels
- content descriptions

8. If the DOM does not provide enough information
for a reliable locator, omit it.

9. Never guess a selector merely because it would
be convenient for automation.

10. Avoid fragile selectors based on:

- generated CSS classes
- deep DOM hierarchy
- nth-child
- nth-of-type
- random framework attributes
- dynamic IDs
- positional selectors

11. XPath should be used only when the selected
framework supports it and no better stable selector exists.

=====================================================
LOCATOR DESIGN
=====================================================

12. Locator names must be descriptive and based on
the user-facing purpose.

GOOD examples:

usernameField
passwordField
loginButton
searchInput
profileTab
submitButton
validationMessage
accountBalance
beneficiaryDropdown

BAD examples:

div1
input2
element123
locatorA
buttonElement
fieldX

13. Avoid duplicate locators representing the same element.

14. Important reusable locators must remain accessible
to the automation layer.

15. Do not hide important locators behind private access
when Step Definitions or tests may reasonably need them
for assertions.

=====================================================
ACTION METHODS
=====================================================

16. Create reusable methods only for meaningful
user actions supported by the DOM.

Examples:

enterUsername()
enterPassword()
clickSubmit()
openProfile()
selectBeneficiary()
enterTransferAmount()
search()
openMenu()

17. Action methods MUST reuse already declared
locators, selector properties or selector getters.

18. Do NOT recreate selectors inside action methods.

19. Do NOT generate methods for functionality
that is not supported by the DOM.

20. Do NOT create meaningless wrapper methods
just to increase code size.

21. A useful combined workflow method may be added
only when it represents an obvious user action
supported by the supplied DOM.

For example, on a login form it may be reasonable
to provide a login(username, password) method
if username, password and submit controls are
all clearly present.

=====================================================
ASSERTION RESPONSIBILITY
=====================================================

22. Do NOT put test assertions inside the Page Object.

The Page Object should expose:

- selectors / locators
- reusable user actions

Assertions belong in:

- tests
- Step Definitions
- assertion/helper layers

=====================================================
NO INVENTED BEHAVIOR
=====================================================

23. Do NOT assume:

- Login success behavior
- Redirect behavior
- Authentication rules
- Backend responses
- API behavior
- Database behavior
- Error messages
- Success messages
- Permissions
- Roles
- Business rules
- Navigation destinations
- URLs

unless directly supported by the supplied input.

24. Do NOT invent URLs.

25. Do NOT generate navigation methods that require
an invented destination.

=====================================================
DO NOT GENERATE
=====================================================

26. Do NOT generate test cases.

27. Do NOT generate BDD scenarios.

28. Do NOT generate Step Definitions.

29. Do NOT generate fixtures.

30. Do NOT generate configuration files.

31. Do NOT generate sample tests.

32. Do NOT generate explanation text.

=====================================================
LANGUAGE QUALITY
=====================================================

${languageRules}

=====================================================
STEP-DEFINITION COMPATIBILITY
=====================================================

The Page Object may later be consumed by BDD
Step Definitions.

Therefore:

- important automation elements must remain reusable
- action methods must be accessible
- selectors must remain inside the Page Object
- method names must clearly express user actions
- Step Definitions should not need to create selectors
- Step Definitions should not need unsafe access workarounds

=====================================================
FINAL QUALITY CHECK
=====================================================

Before returning the code verify:

- class name is exactly ${className}
- selected stack is exactly ${stackLabel}
- every selector is supported by the DOM
- no selector is invented
- no duplicate selector exists
- action methods reuse declared selectors
- no unnecessary assertions exist
- no test code exists
- no BDD code exists
- no Step Definition code exists
- no unused imports exist
- no duplicate methods exist
- syntax is valid for the selected language
- output is maintainable

=====================================================
OUTPUT RULES
=====================================================

Return ONLY source code.

Do NOT return Markdown.

Do NOT use triple backticks.

Do NOT include explanations before the code.

Do NOT include explanations after the code.

=====================================================
APPLICATION DOM
=====================================================

${dom}
`;
}

export function getPomReviewerPrompt(
  dom: string,
  generatedCode: string,
  className: string,
  language: PomLanguage,
  framework: PomFramework
): string {
  const stackLabel =
    getPomStackLabel(
      language,
      framework
    );

  const stackRules =
    getStackRules(
      language,
      framework,
      className
    );

  const languageRules =
    getLanguageQualityRules(
      language
    );

  return `
You are an experienced Senior QA Automation Engineer.

Review and improve a Page Object Model generated
by another AI QA Engineer.

Return the FINAL production-quality Page Object only.

=====================================================
SELECTED STACK
=====================================================

${stackLabel}

=====================================================
CLASS NAME
=====================================================

Preserve this class name exactly:

${className}

${stackRules}

=====================================================
REVIEW RESPONSIBILITIES
=====================================================

1. Preserve the selected programming language.

2. Preserve the selected automation framework.

3. Preserve the class name exactly.

4. Fix invalid syntax.

5. Remove duplicate locators.

6. Remove unused locators.

7. Remove unnecessary imports.

8. Remove duplicate methods.

9. Improve locator stability.

10. Prefer meaningful user-facing selectors.

11. Every selector MUST be supported by the supplied DOM.

12. Do NOT invent selectors.

13. Do NOT invent functionality.

14. Avoid fragile selectors.

15. Keep locator names descriptive.

16. Keep action methods reusable and user-focused.

17. Action methods MUST reuse selectors already
declared in the Page Object.

18. Do NOT recreate selectors inside methods.

19. Important reusable automation elements must
remain accessible to tests and Step Definitions.

20. Do NOT add assertions to the Page Object.

21. Do NOT generate tests.

22. Do NOT generate BDD scenarios.

23. Do NOT generate Step Definitions.

24. Do NOT invent URLs.

25. Do NOT invent redirect behavior.

26. Do NOT invent error or success behavior.

=====================================================
LANGUAGE QUALITY
=====================================================

${languageRules}

=====================================================
FINAL CHECK
=====================================================

Verify:

- class name is exactly ${className}
- stack is exactly ${stackLabel}
- selectors exist in the DOM
- no selector is invented
- no duplicate locator exists
- no unused locator exists
- methods reuse declared selectors
- no unnecessary assertions exist
- no test code exists
- syntax is valid
- code is maintainable

=====================================================
OUTPUT RULES
=====================================================

Return ONLY source code.

Do NOT return Markdown.

Do NOT use triple backticks.

Do NOT include explanations.

=====================================================
ORIGINAL DOM
=====================================================

${dom}

=====================================================
GENERATED PAGE OBJECT
=====================================================

${generatedCode}
`;
}