export type PomLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "csharp";

export type PomFramework =
  | "playwright"
  | "selenium"
  | "webdriverio"
  | "cypress"
  | "mobilewright";

export const LANGUAGE_OPTIONS: {
  value: PomLanguage;
  label: string;
}[] = [
  {
    value: "typescript",
    label: "TypeScript",
  },
  {
    value: "javascript",
    label: "JavaScript",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "csharp",
    label: "C#",
  },
];

const FRAMEWORK_LABELS: Record<
  PomFramework,
  string
> = {
  playwright:
    "Playwright",

  selenium:
    "Selenium",

  webdriverio:
    "WebdriverIO",

  cypress:
    "Cypress",

  mobilewright:
    "Mobilewright",
};

const SUPPORTED_STACKS: Record<
  PomLanguage,
  PomFramework[]
> = {
  typescript: [
    "playwright",
    "selenium",
    "webdriverio",
    "cypress",
    "mobilewright",
  ],

  javascript: [
    "playwright",
    "selenium",
    "webdriverio",
    "cypress",
  ],

  python: [
    "playwright",
    "selenium",
  ],

  java: [
    "playwright",
    "selenium",
  ],

  csharp: [
    "playwright",
    "selenium",
  ],
};

// =====================================================
// FRAMEWORKS FOR LANGUAGE
// =====================================================

export function getFrameworksForLanguage(
  language: PomLanguage
): PomFramework[] {
  return [
    ...SUPPORTED_STACKS[
      language
    ],
  ];
}

// =====================================================
// FRAMEWORK LABEL
// =====================================================

export function getFrameworkLabel(
  framework: PomFramework
): string {
  return FRAMEWORK_LABELS[
    framework
  ];
}

// =====================================================
// VALID STACK
// =====================================================

export function isSupportedPomStack(
  language: PomLanguage,
  framework: PomFramework
): boolean {
  return SUPPORTED_STACKS[
    language
  ].includes(
    framework
  );
}

// =====================================================
// FILE EXTENSION
// =====================================================

export function getPomFileExtension(
  language: PomLanguage
): string {
  switch (language) {
    case "typescript":
      return "ts";

    case "javascript":
      return "js";

    case "python":
      return "py";

    case "java":
      return "java";

    case "csharp":
      return "cs";

    default:
      return "txt";
  }
}

// =====================================================
// LANGUAGE LABEL
// =====================================================

export function getLanguageLabel(
  language: PomLanguage
): string {
  return (
    LANGUAGE_OPTIONS.find(
      (option) =>
        option.value ===
        language
    )?.label ||
    language
  );
}

// =====================================================
// FULL STACK LABEL
// =====================================================

export function getPomStackLabel(
  language: PomLanguage,
  framework: PomFramework
): string {
  return `${getFrameworkLabel(
    framework
  )} ${getLanguageLabel(
    language
  )}`;
}