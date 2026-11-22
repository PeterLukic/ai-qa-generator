"use client";

import {
  useState,
} from "react";

import {
  cleanDom,
} from "@/lib/domCleaner";

import {
  LANGUAGE_OPTIONS,
  getFrameworkLabel,
  getFrameworksForLanguage,
  getPomFileExtension,
  getPomStackLabel,
  type PomFramework,
  type PomLanguage,
} from "@/lib/pomConfig";

type PomResult = {
  success: boolean;

  className: string;

  language:
    PomLanguage;

  framework:
    PomFramework;

  stackLabel:
    string;

  fileExtension:
    string;

  model:
    string;

  code:
    string;
};

export default function PomPage() {
  const [
    fileName,
    setFileName,
  ] =
    useState("");

  const [
    domContent,
    setDomContent,
  ] =
    useState("");

  const [
    className,
    setClassName,
  ] =
    useState(
      "PageExample"
    );

  const [
    language,
    setLanguage,
  ] =
    useState<PomLanguage>(
      "typescript"
    );

  const [
    framework,
    setFramework,
  ] =
    useState<PomFramework>(
      "playwright"
    );

  const [
    result,
    setResult,
  ] =
    useState<PomResult | null>(
      null
    );

  const [
    isGenerating,
    setIsGenerating,
  ] =
    useState(false);

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const availableFrameworks =
    getFrameworksForLanguage(
      language
    );

  // =====================================================
  // UPLOAD DOM
  // =====================================================

  const handleFileUpload =
    async (
      event:
        React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target
          .files?.[0];

      if (!file) {
        return;
      }

      try {
        const content =
          await file.text();

        const cleaned =
          cleanDom(
            content
          );

        setFileName(
          file.name
        );

        setDomContent(
          cleaned
        );

        setResult(
          null
        );

        setCopied(
          false
        );

        setError("");

      } catch (err) {
        console.error(
          "File reading error:",
          err
        );

        setError(
          "Unable to read the selected file."
        );
      }
    };

  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  const handleLanguageChange =
    (
      nextLanguage:
        PomLanguage
    ) => {
      const frameworks =
        getFrameworksForLanguage(
          nextLanguage
        );

      setLanguage(
        nextLanguage
      );

      if (
        !frameworks.includes(
          framework
        )
      ) {
        setFramework(
          frameworks[0]
        );
      }

      setResult(
        null
      );

      setCopied(
        false
      );

      setError("");
    };

  // =====================================================
  // FRAMEWORK CHANGE
  // =====================================================

  const handleFrameworkChange =
    (
      nextFramework:
        PomFramework
    ) => {
      setFramework(
        nextFramework
      );

      setResult(
        null
      );

      setCopied(
        false
      );

      setError("");
    };

  // =====================================================
  // GENERATE POM
  // =====================================================

  const generatePom =
    async () => {
      if (!domContent) {
        setError(
          "Please upload a DOM / HTML file."
        );

        return;
      }

      if (
        !className.trim()
      ) {
        setError(
          "Please enter a Page Object class name."
        );

        return;
      }

      const apiKey =
        sessionStorage.getItem(
          "groqApiKey"
        );

      const generatorModel =
        localStorage.getItem(
          "generatorModel"
        ) ||
        "openai/gpt-oss-20b";

      const reviewerModel =
        localStorage.getItem(
          "reviewerModel"
        ) ||
        "openai/gpt-oss-120b";

      if (!apiKey) {
        setError(
          "Groq API key is not configured. Please configure it in Settings."
        );

        return;
      }

      try {
        setIsGenerating(
          true
        );

        setError("");

        setResult(
          null
        );

        setCopied(
          false
        );

        const response =
          await fetch(
            "/api/generate-pom",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  dom:
                    domContent,

                  className:
                    className.trim(),

                  language,

                  framework,

                  apiKey,

                  generatorModel,

                  reviewerModel,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.error ||
              "Failed to generate Page Object Model."
          );
        }

        setResult(
          data
        );

      } catch (err) {
        console.error(
          "POM generation error:",
          err
        );

        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            "Something went wrong."
          );
        }

      } finally {
        setIsGenerating(
          false
        );
      }
    };

  // =====================================================
  // COPY CODE
  // =====================================================

  const copyCode =
    async () => {
      if (
        !result?.code
      ) {
        return;
      }

      try {
        await navigator
          .clipboard
          .writeText(
            result.code
          );

        setCopied(
          true
        );

        setTimeout(
          () => {
            setCopied(
              false
            );
          },
          2000
        );

      } catch (err) {
        console.error(
          "Copy failed:",
          err
        );

        setError(
          "Unable to copy generated code."
        );
      }
    };

  // =====================================================
  // DOWNLOAD SOURCE FILE
  // =====================================================

  const downloadCode =
    () => {
      if (
        !result?.code
      ) {
        return;
      }

      try {
        const extension =
          result.fileExtension ||
          getPomFileExtension(
            result.language
          );

        const outputFileName =
          `${result.className}.${extension}`;

        const blob =
          new Blob(
            [
              result.code,
            ],
            {
              type:
                "text/plain;charset=utf-8",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          url;

        link.download =
          outputFileName;

        document.body
          .appendChild(
            link
          );

        link.click();

        document.body
          .removeChild(
            link
          );

        URL.revokeObjectURL(
          url
        );

      } catch (err) {
        console.error(
          "Download failed:",
          err
        );

        setError(
          "Unable to download the generated Page Object."
        );
      }
    };

  // =====================================================
  // CURRENT FILE EXTENSION
  // =====================================================

  const selectedExtension =
    getPomFileExtension(
      language
    );

  const selectedStack =
    getPomStackLabel(
      language,
      framework
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 rounded-2xl bg-white p-8 shadow">

          <h1 className="text-3xl font-bold text-gray-900">
            Create Page Object Model
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            Upload application DOM / HTML and generate
            reusable Page Object Models for multiple
            automation frameworks and programming languages.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              DOM → POM
            </span>

            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              5 Languages
            </span>

            <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
              Multiple Frameworks
            </span>

          </div>

        </div>

        {/* =====================================================
            GENERATOR
        ===================================================== */}

        <div className="rounded-2xl bg-white p-8 shadow">

          {/* DOM UPLOAD */}

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              Application DOM
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload HTML or DOM structure from the page
              or screen you want to automate.
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 transition hover:border-blue-500">

              <span className="font-medium text-gray-700">
                Upload DOM / HTML
              </span>

              <span className="mt-2 text-sm text-gray-500">
                .html, .htm or .txt
              </span>

              <input
                type="file"
                accept=".html,.htm,.txt"
                className="hidden"

                onChange={
                  handleFileUpload
                }
              />

            </label>

            {fileName && (

              <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-700">

                Selected file:{" "}

                <strong>
                  {fileName}
                </strong>

              </div>

            )}

            {domContent && (

              <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-700">

                ✓ DOM successfully loaded and cleaned.

              </div>

            )}

          </div>

          {/* =====================================================
              OPTIONS
          ===================================================== */}

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {/* CLASS NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Page Object Class Name
              </label>

              <input
                type="text"

                value={
                  className
                }

                onChange={(
                  event
                ) => {
                  setClassName(
                    event.target
                      .value
                  );

                  setResult(
                    null
                  );

                  setCopied(
                    false
                  );
                }}

                placeholder="PageLogin"

                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-gray-500">
                Example: PageLogin, PageHome, PageTransfer
              </p>

            </div>

            {/* LANGUAGE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Programming Language
              </label>

              <select
                value={
                  language
                }

                onChange={(
                  event
                ) =>
                  handleLanguageChange(
                    event.target
                      .value as PomLanguage
                  )
                }

                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                {LANGUAGE_OPTIONS.map(
                  (
                    option
                  ) => (

                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>

                  )
                )}

              </select>

              <p className="mt-2 text-sm text-gray-500">
                Select the programming language first.
              </p>

            </div>

            {/* FRAMEWORK */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Framework
              </label>

              <select
                value={
                  framework
                }

                onChange={(
                  event
                ) =>
                  handleFrameworkChange(
                    event.target
                      .value as PomFramework
                  )
                }

                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                {availableFrameworks.map(
                  (
                    frameworkOption
                  ) => (

                    <option
                      key={
                        frameworkOption
                      }
                      value={
                        frameworkOption
                      }
                    >
                      {
                        getFrameworkLabel(
                          frameworkOption
                        )
                      }
                    </option>

                  )
                )}

              </select>

              <p className="mt-2 text-sm text-gray-500">
                Available frameworks depend on the selected language.
              </p>

            </div>

          </div>

          {/* STACK PREVIEW */}

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

            <span className="text-sm text-gray-500">
              Selected stack:
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {selectedStack}
            </span>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
              .{selectedExtension}
            </span>

          </div>

          {/* GENERATE */}

          <button
            onClick={
              generatePom
            }

            disabled={
              isGenerating
            }

            className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >

            {isGenerating
              ? `QA is generating ${selectedStack} Page Object...`
              : "Generate Page Object Model"}

          </button>

          {/* ERROR */}

          {error && (

            <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">

              {error}

            </div>

          )}

        </div>

        {/* =====================================================
            RESULT
        ===================================================== */}

        {result && (

          <div className="mt-8 rounded-2xl bg-white p-8 shadow">

            {/* RESULT HEADER */}

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Generated Page Object Model
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  AI Generated & QA Reviewed
                </p>

              </div>

              <div className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                {result.model}
              </div>

            </div>

            {/* FILE INFO + BUTTONS */}

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

              <div className="flex flex-wrap gap-3">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">

                  {result.className}.
                  {result.fileExtension}

                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">

                  {result.stackLabel}

                </span>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={
                    copyCode
                  }

                  className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >

                  {copied
                    ? "✓ Copied"
                    : "Copy Code"}

                </button>

                <button
                  onClick={
                    downloadCode
                  }

                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >

                  Download{" "}

                  {result.className}.
                  {result.fileExtension}

                </button>

              </div>

            </div>

            {/* CODE */}

            <div className="overflow-hidden rounded-xl bg-gray-950">

              <div className="flex items-center justify-between border-b border-gray-800 px-5 py-3 text-sm text-gray-400">

                <span>
                  {result.className}.
                  {result.fileExtension}
                </span>

                <span>
                  {result.stackLabel}
                </span>

              </div>

              <pre className="max-h-[700px] overflow-auto p-6 text-sm leading-6 text-gray-100">

                <code>
                  {result.code}
                </code>

              </pre>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}