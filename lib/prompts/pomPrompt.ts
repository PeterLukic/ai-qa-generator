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

=====================================================
WEBDRIVERIO SELECTOR PRIORITY
=====================================================

Prefer selectors based on stable, semantic DOM attributes.

Use this general priority when supported by the DOM:

1. data-testid or another explicit test-specific stable attribute
2. name
3. stable id
4. semantic attributes such as:
   - input type
   - button type
   - href when meaningful and stable
   - aria attributes when explicitly present
5. stable CSS selectors
6. CSS classes only when they clearly represent a stable
   business or automation identifier

IMPORTANT:

- Prefer semantic element attributes over styling classes.
- Do NOT use a styling or framework CSS class when a stable
  name, id, type, test attribute or other semantic selector exists.
- Avoid selectors such as generated framework classes.
- Avoid classes primarily used for visual styling.
- Avoid deeply nested CSS selectors.
- Avoid nth-child and positional selectors.
- Avoid XPath unless absolutely necessary.
- Never invent selector attributes.

For example:

PREFERRED:

$('input[name="username"]')

$('button[type="submit"]')

AVOID WHEN A SEMANTIC SELECTOR EXISTS:

$('.orangehrm-login-button')

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

=====================================================
WEBDRIVERIO SELECTOR PRIORITY
=====================================================

Prefer selectors based on stable, semantic DOM attributes.

Use this general priority when supported by the DOM:

1. data-testid or another explicit test-specific stable attribute
2. name
3. stable id
4. semantic attributes such as:
   - input type
   - button type
   - href when meaningful and stable
   - aria attributes when explicitly present
5. stable CSS selectors
6. CSS classes only when they clearly represent a stable
   business or automation identifier

IMPORTANT:

- Prefer semantic element attributes over styling classes.
- Do NOT use a styling or framework CSS class when a stable
  name, id, type, test attribute or other semantic selector exists.
- Avoid selectors such as generated framework classes.
- Avoid classes primarily used for visual styling.
- Avoid deeply nested CSS selectors.
- Avoid nth-child and positional selectors.
- Avoid XPath unless absolutely necessary.
- Never invent selector attributes.

For example:

PREFERRED:

$('input[name="username"]')

$('button[type="submit"]')

AVOID WHEN A SEMANTIC SELECTOR EXISTS:

$('.orangehrm-login-button')

Use public selector getters.

Methods must reuse those getters.

Do not recreate selectors inside methods.

Do not invent selector attributes.

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
  readonly title;
  readonly emailField;
  readonly passwordField;
  readonly loginButton;

  constructor(screen: MobileScreen) {
    this.title =
      screen.getByTestId(
        "login_title"
      );

    this.emailField =
      screen.getByTestId(
        "login_email_text_field"
      );

    this.passwordField =
      screen.getByTestId(
        "login_password_text_field"
      );

    this.loginButton =
      screen.getByTestId(
        "login_submit_button"
      );
  }

  async enterEmail(
    email: string
  ): Promise<void> {
    await this.emailField.fill(
      email
    );
  }

  async enterPassword(
    password: string
  ): Promise<void> {
    await this.passwordField.fill(
      password
    );
  }

  async tapLoginButton(): Promise<void> {
    await this.loginButton.tap();
  }
}

=====================================================
MOBILEWRIGHT INPUT MODEL
=====================================================

Treat the supplied input as a mobile accessibility/view tree
when Mobilewright is selected.

Do NOT treat the supplied input as normal web HTML.

When later universal rules refer to "DOM",
interpret "DOM" as the supplied mobile view tree
for Mobilewright generation.

The mobile accessibility/view tree is the source of truth.

=====================================================
MOBILEWRIGHT LOCATOR PRIORITY
=====================================================

Use this locator priority when supported by the supplied
mobile view tree:

1. getByTestId()
2. getByLabel()
3. getByRole()
4. getByText()
5. getByPlaceholder() only when placeholder information
   is explicitly present in the mobile view tree

Prefer explicit mobile test IDs when available.

Example:

screen.getByTestId(
  "login_email_text_field"
)

is preferred when that exact test ID exists in the
supplied mobile tree.

Do NOT invent a test ID based on this example.

=====================================================
MOBILEWRIGHT UNIQUE LOCATOR RULES
=====================================================

Every meaningful Page Object element should have a locator
that identifies its intended semantic element as uniquely
and reliably as the supplied mobile tree allows.

Do NOT assign the exact same locator expression to two
different semantic elements.

For example, this is NOT acceptable:

this.title =
  screen.getByText(
    "Login"
  );

this.loginButton =
  screen.getByText(
    "Login"
  );

if the screen contains both a title and a button
with the visible text "Login".

In that case:

- Prefer getByTestId() when an explicit test ID exists.
- Prefer getByLabel() when an explicit accessibility label exists.
- Prefer getByRole() when role information exists and distinguishes
  the intended element.
- Use getByText() only when the text locator identifies the intended
  element reliably enough from the supplied tree.

If two different elements share the same visible text and
the supplied mobile tree does NOT provide enough evidence
to distinguish them, OMIT the ambiguous locator rather than
inventing a selector.

Do not use one ambiguous text locator merely because it
matches the expected visible text.

=====================================================
MOBILEWRIGHT SEMANTIC NAMING
=====================================================

Locator property names MUST reflect the actual semantic
purpose and interaction type of the element.

Examples:

GOOD:

loginButton
forgotPasswordButton
forgotPasswordLink
registerButton
emailField
passwordField
screenTitle
validationMessage

BAD:

forgotPasswordHeader

when that element is actually tappable and used as a button
or link.

If a locator is used by a method named:

tapForgotPasswordButton()

then the corresponding locator should normally be named:

forgotPasswordButton

unless the supplied mobile tree clearly identifies the control
as another semantic type such as a link.

Do NOT name an interactive element "Header" merely because
its visible text resembles a heading.

=====================================================
MOBILE VIEW TREE IS THE SOURCE OF TRUTH
=====================================================

Every locator MUST be supported by the supplied
mobile view tree or by additional explicit locator
information supplied by the user.

Do NOT invent:

- test IDs
- resource IDs
- accessibility labels
- content descriptions
- visible text
- placeholders
- roles
- platform attributes
- native selectors

If a reliable locator cannot be determined,
omit that element.

Never invent a test ID merely because an example
structure contains a similar test ID.

=====================================================
MEANINGFUL MOBILE ELEMENTS
=====================================================

Generate locators only for meaningful mobile
automation elements that are actually present.

Examples include:

- screen titles
- email fields
- username fields
- password fields
- buttons
- forgot-password controls
- registration controls
- social-login controls
- navigation controls
- tabs
- menus
- checkboxes
- radio buttons
- switches
- dropdowns
- validation messages
- error messages
- success messages
- important status text
- business-critical information

Do NOT create a locator for every node.

Ignore:

- layout-only nodes
- decorative nodes
- meaningless wrappers
- framework implementation nodes
- hidden technical nodes
- non-interactive noise

=====================================================
MOBILE ACTION METHODS
=====================================================

Use:

fill()

for editable fields when supported.

Use:

tap()

for tappable controls when supported.

Action methods MUST reuse already declared locators.

Do NOT recreate locators inside action methods.

Examples:

async enterEmail(
  email: string
): Promise<void> {
  await this.emailField.fill(
    email
  );
}

async tapLoginButton(): Promise<void> {
  await this.loginButton.tap();
}

Generate action methods only when the supplied
mobile tree clearly supports that interaction.

Method names must match the semantic locator names.

For example:

readonly forgotPasswordButton;

should pair naturally with:

async tapForgotPasswordButton(): Promise<void>

Do NOT create a tap method for an element that the
supplied mobile tree does not identify as interactive.

=====================================================
COMBINED MOBILE WORKFLOWS
=====================================================

A combined workflow method may be generated when
the full interaction is clearly supported.

For example, if username/email, password and login
controls are all present:

async login(
  username: string,
  password: string
): Promise<void> {
  await this.enterUsername(
    username
  );

  await this.enterPassword(
    password
  );

  await this.tapLoginButton();
}

Do NOT create combined flows that require assumed
navigation or unsupported behavior.

=====================================================
DYNAMIC MESSAGES AND ADDITIONAL LOCATORS
=====================================================

A validation, error or success message may be exposed
as a locator when its locator evidence is supplied.

For example, if the user separately supplies:

Pogrešni podaci za prijavu ili nalog nije aktivan.

and explicitly identifies it as an accessibility label,
the generated Page Object may contain:

this.failedLoginMessage =
  screen.getByLabel(
    "Pogrešni podaci za prijavu ili nalog nije aktivan."
  );

However:

- Do NOT invent an error message.
- Do NOT assume an error exists just because a login screen exists.
- Do NOT assume successful login behavior.
- Do NOT assume failed login behavior.
- Do NOT infer a locator for a dynamic message without evidence.

=====================================================
MOBILEWRIGHT REVIEW CHECK
=====================================================

Before returning Mobilewright code verify:

- No two different semantic elements use the exact same
  ambiguous locator expression.
- A title and button with identical text are not both located
  using the same getByText() call.
- Tappable controls have names such as Button, Link, Tab,
  MenuItem or another correct semantic name.
- Non-interactive text is not given unnecessary tap methods.
- Every getByTestId() value exists in the supplied mobile input.
- Every getByLabel() value exists in the supplied mobile input.
- Every getByText() value exists in the supplied mobile input.
- Every getByRole() call is supported by explicit role evidence.
- No web CSS selector has been introduced.
- Action methods reuse the declared locators.

=====================================================
IMPORTANT MOBILEWRIGHT RULES
=====================================================

- Generate valid TypeScript.
- Generate Mobilewright code, not Playwright Web code.
- Prefer getByTestId() when explicit reliable mobile test IDs exist.
- Prefer getByLabel() when an explicit accessibility label exists.
- Prefer getByRole() when explicit role evidence exists.
- Use getByText() only when it is sufficiently unambiguous.
- Do not convert web CSS selectors into Mobilewright selectors.
- Do not use CSS selectors.
- Do not invent resource IDs.
- Do not invent test IDs.
- Do not invent labels.
- Do not invent visible text.
- Do not invent roles.
- Do not invent user flows.
- Do not invent navigation destinations.
- Do not invent URLs.
- Do not include assertions inside the Page Object.
- Important locators must remain reusable by tests
  and Step Definitions.
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

1. Analyze the supplied input carefully before generating code.

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

4. Do NOT create a locator for every element.

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
SUPPLIED INPUT IS THE SOURCE OF TRUTH
=====================================================

6. Every selector or locator MUST be supported
by information in the supplied input.

For web frameworks, the supplied input is normally
the application DOM / HTML.

For Mobilewright, the supplied input must be treated
as the mobile accessibility/view tree.

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

8. If the supplied input does not provide enough
information for a reliable locator, omit it.

9. Never guess a selector merely because it would
be convenient for automation.

10. Avoid fragile selectors based on:

- generated CSS classes
- styling-only CSS classes
- framework-specific CSS classes
- deep hierarchy
- nth-child
- nth-of-type
- random framework attributes
- dynamic IDs
- positional selectors

11. Prefer semantic attributes over styling classes
whenever both are available.

Examples of semantic evidence include:

- name
- stable id
- type
- data-testid
- aria attributes
- label
- placeholder
- role
- stable href

12. XPath should be used only when the selected
framework supports it and no better stable selector exists.

=====================================================
LOCATOR DESIGN
=====================================================

13. Locator names must be descriptive and based on
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

14. Avoid duplicate locators representing the same element.

15. Do NOT assign an identical ambiguous locator to
different semantic elements.

If two elements share the same visible text,
prefer a locator that distinguishes their semantic roles.

If the supplied input cannot distinguish them reliably,
omit the ambiguous locator rather than inventing one.

16. Important reusable locators must remain accessible
to the automation layer.

17. Do not hide important locators behind private access
when Step Definitions or tests may reasonably need them
for assertions.

=====================================================
ACTION METHODS
=====================================================

18. Create reusable methods only for meaningful
user actions supported by the supplied input.

Examples:

enterUsername()
enterPassword()
clickSubmit()
openProfile()
selectBeneficiary()
enterTransferAmount()
search()
openMenu()

19. Action methods MUST reuse already declared
locators, selector properties or selector getters.

20. Do NOT recreate selectors inside action methods.

21. Do NOT generate methods for functionality
that is not supported by the supplied input.

22. Do NOT create meaningless wrapper methods
just to increase code size.

23. A useful combined workflow method may be added
only when it represents an obvious user action
supported by the supplied input.

For example, on a login form it may be reasonable
to provide a login(username, password) method
if username, password and submit controls are
all clearly present.

=====================================================
ASSERTION RESPONSIBILITY
=====================================================

24. Do NOT put test assertions inside the Page Object.

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

25. Do NOT assume:

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

26. Do NOT invent URLs.

27. Do NOT generate navigation methods that require
an invented destination.

=====================================================
DO NOT GENERATE
=====================================================

28. Do NOT generate test cases.

29. Do NOT generate BDD scenarios.

30. Do NOT generate Step Definitions.

31. Do NOT generate fixtures.

32. Do NOT generate configuration files.

33. Do NOT generate sample tests.

34. Do NOT generate explanation text.

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
- every selector is supported by the supplied input
- no selector is invented
- semantic selectors are preferred over styling classes
- no duplicate selector exists
- no ambiguous locator is assigned to different semantic elements
- action methods reuse declared selectors
- locator names match the semantic role of the elements
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
APPLICATION INPUT
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

11. Every selector MUST be supported by the supplied input.

12. Do NOT invent selectors.

13. Do NOT invent functionality.

14. Avoid fragile selectors.

15. Prefer semantic selectors over styling or framework CSS classes
when a stable semantic alternative exists.

16. Do NOT allow two different semantic elements to use the
same ambiguous locator expression.

For example, if both a title and a button display "Login",
do not keep both as:

getByText("Login")

unless the supplied input provides enough evidence that the
locator expressions uniquely distinguish the elements.

17. If a locator cannot be made reliable using evidence from
the supplied input, remove that locator rather than inventing one.

18. Keep locator names descriptive and semantically correct.

A tappable button should normally be named somethingButton,
not somethingHeader.

19. Keep action methods reusable and user-focused.

20. Action methods MUST reuse selectors already
declared in the Page Object.

21. Do NOT recreate selectors inside methods.

22. Important reusable automation elements must
remain accessible to tests and Step Definitions.

23. Do NOT add assertions to the Page Object.

24. Do NOT generate tests.

25. Do NOT generate BDD scenarios.

26. Do NOT generate Step Definitions.

27. Do NOT invent URLs.

28. Do NOT invent redirect behavior.

29. Do NOT invent error or success behavior.

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
- selectors exist in the supplied input
- no selector is invented
- semantic selectors are preferred over styling classes
- no duplicate locator exists
- no ambiguous locator is assigned to different semantic elements
- locator names represent the actual semantic element
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
ORIGINAL APPLICATION INPUT
=====================================================

${dom}

=====================================================
GENERATED PAGE OBJECT
=====================================================

${generatedCode}
`;
}