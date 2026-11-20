"use client";

import { useState } from "react";
import { cleanDom } from "@/lib/domCleaner";
import Image from "next/image";

type TestCaseFormat = "simple" | "detailed" | "bdd";

type SimpleTestCase = {
  id: string;
  name: string;
  description: string;
};

type DetailedStep = {
  step: number;
  action: string;
  expectedResult: string;
};

type DetailedTestCase = {
  id: string;
  name: string;
  description: string;
  preconditions: string[];
  steps: DetailedStep[];
  inputData: string[];
  priority: "Critical" | "High" | "Medium" | "Low";
  actualResult: string;
  testEnvironment: string;
  executionStatus: string;
  bugSeverity: string;
  bugPriority: string;
  notes: string;
};

type BddScenario = {
  id: string;
  name: string;
  tags: string[];
  given: string[];
  when: string[];
  then: string[];
};

type GeneratedResult = {
  success: boolean;
  format: TestCaseFormat;
  model?: string;

  testCases?: SimpleTestCase[] | DetailedTestCase[];

  feature?: string;
  scenarios?: BddScenario[];
};

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const [numberOfTests, setNumberOfTests] =
    useState<number>(10);

  const [testCaseFormat, setTestCaseFormat] =
    useState<TestCaseFormat>("detailed");

  const [result, setResult] =
    useState<GeneratedResult | null>(null);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // GENERATE TESTS
  // =====================================================

  const generateTests = async () => {
    if (!fileContent) {
      alert("Please upload a DOM / HTML file first.");
      return;
    }

    // =====================================================
    // LOAD OLLAMA SETTINGS
    // =====================================================

    const apiKey =
      sessionStorage.getItem("ollamaApiKey");

    const generatorModel =
      localStorage.getItem("generatorModel") ||
      "gpt-oss:20b";

    const reviewerModel =
      localStorage.getItem("reviewerModel") ||
      "gpt-oss:120b";

    // API key must be configured in Settings
    if (!apiKey) {
      setError(
        "Ollama API key is not configured. Please configure it in Settings."
      );

      return;
    }

    try {
      setIsGenerating(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          dom: fileContent,
          numberOfTests,
          testCaseFormat,

          // Ollama Settings
          apiKey,
          generatorModel,
          reviewerModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to generate regression test cases."
        );
      }

      console.log("Backend response:", data);

      setResult(data);
    } catch (err) {
      console.error("Generation error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="mb-8 rounded-2xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold text-gray-900">
            AI QA Generator
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            Generate important regression test cases from your application DOM
            using AI-assisted QA review.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Simple
            </span>

            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              Detailed
            </span>

            <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
              BDD / Gherkin
            </span>
          </div>
        </div>

        {/* =====================================================
            GENERATOR
        ===================================================== */}

        <div className="rounded-xl bg-white p-8 shadow">

          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Upload DOM / HTML
          </h2>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 hover:border-blue-500">

            <span className="text-lg font-medium text-gray-700">
              Click to upload DOM or HTML file
            </span>

            <span className="mt-2 text-sm text-gray-500">
              .html or .txt
            </span>

            <input
              type="file"
              accept=".html,.txt"
              className="hidden"
              onChange={async (event) => {
                const file =
                  event.target.files?.[0];

                if (!file) return;

                setFileName(file.name);

                const content =
                  await file.text();

                const cleanedContent =
                  cleanDom(content);

                setFileContent(cleanedContent);

                setResult(null);
                setError("");

                console.log(
                  "Original DOM length:",
                  content.length
                );

                console.log(
                  "Cleaned DOM length:",
                  cleanedContent.length
                );
              }}
            />

          </label>

          {/* SELECTED FILE */}

          {fileName && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-700">
              Selected file:{" "}
              <strong>{fileName}</strong>
            </div>
          )}

          {/* CLEANED DOM */}

          {fileContent && (
            <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-700">
              ✓ DOM successfully loaded and cleaned.
            </div>
          )}

          {/* =====================================================
              SETTINGS
          ===================================================== */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* NUMBER OF TESTS */}

            <div>
              <label className="block font-medium text-gray-700">
                Number of test cases
              </label>

              <select
                value={numberOfTests}
                onChange={(event) =>
                  setNumberOfTests(
                    Number(event.target.value)
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* FORMAT */}

            <div>
              <label className="block font-medium text-gray-700">
                Test case format
              </label>

              <select
                value={testCaseFormat}
                onChange={(event) =>
                  setTestCaseFormat(
                    event.target.value as TestCaseFormat
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
              >
                <option value="simple">
                  Simple Test Cases
                </option>

                <option value="detailed">
                  Detailed Test Cases
                </option>

                <option value="bdd">
                  BDD / Gherkin
                </option>
              </select>
            </div>

          </div>

          {/* =====================================================
              GENERATE BUTTON
          ===================================================== */}

          <button
            onClick={generateTests}
            disabled={isGenerating}
            className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isGenerating
              ? "QA is generating test cases..."
              : "Generate Regression Tests"}
          </button>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

        </div>

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {result && (
          <div className="mt-8 rounded-xl bg-white p-8 shadow">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-gray-900">
                Generated Regression Tests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                AI Generated & QA Reviewed
              </p>

              {result.model && (
                <div className="mt-3 inline-block rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                  {result.model}
                </div>
              )}

            </div>

            {/* =====================================================
                SIMPLE TEST CASES
            ===================================================== */}

            {result.format === "simple" &&
              result.testCases && (

                <div className="space-y-4">

                  {(
                    result.testCases as SimpleTestCase[]
                  ).map((testCase) => (

                    <div
                      key={testCase.id}
                      className="rounded-xl border border-gray-200 p-6"
                    >

                      <div className="text-sm font-bold text-blue-600">
                        {testCase.id}
                      </div>

                      <h3 className="mt-1 text-xl font-bold text-gray-900">
                        {testCase.name}
                      </h3>

                      <p className="mt-3 text-gray-700">
                        {testCase.description}
                      </p>

                    </div>
                  ))}

                </div>
              )}

            {/* =====================================================
                DETAILED TEST CASES
            ===================================================== */}

            {result.format === "detailed" &&
              result.testCases && (

                <div className="space-y-6">

                  {(
                    result.testCases as DetailedTestCase[]
                  ).map((testCase) => (

                    <div
                      key={testCase.id}
                      className="rounded-xl border border-gray-200 p-6"
                    >

                      {/* HEADER */}

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <div className="text-sm font-bold text-blue-600">
                            {testCase.id}
                          </div>

                          <h3 className="mt-1 text-xl font-bold text-gray-900">
                            {testCase.name}
                          </h3>

                        </div>

                        <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                          {testCase.priority}
                        </span>

                      </div>

                      {/* DESCRIPTION */}

                      <div className="mt-5">

                        <h4 className="font-semibold text-gray-900">
                          Description
                        </h4>

                        <p className="mt-1 text-gray-700">
                          {testCase.description}
                        </p>

                      </div>

                      {/* PRECONDITIONS */}

                      {testCase.preconditions?.length > 0 && (

                        <div className="mt-5">

                          <h4 className="font-semibold text-gray-900">
                            Preconditions
                          </h4>

                          <ul className="mt-2 list-disc pl-6 text-gray-700">

                            {testCase.preconditions.map(
                              (precondition, index) => (

                                <li key={index}>
                                  {precondition}
                                </li>

                              )
                            )}

                          </ul>

                        </div>
                      )}

                      {/* =====================================================
                          TEST STEPS
                      ===================================================== */}

                      <div className="mt-5">

                        <h4 className="font-semibold text-gray-900">
                          Test Steps
                        </h4>

                        <div className="mt-3 space-y-3">

                          {testCase.steps?.map(
                            (step) => (

                              <div
                                key={step.step}
                                className="rounded-lg bg-gray-50 p-4"
                              >

                                <div className="font-medium text-gray-900">
                                  {step.step}.{" "}
                                  {step.action}
                                </div>

                                <div className="mt-2 text-green-700">

                                  <strong>
                                    Expected:
                                  </strong>{" "}

                                  {step.expectedResult}

                                </div>

                              </div>
                            )
                          )}

                        </div>

                      </div>

                      {/* INPUT DATA */}

                      {testCase.inputData?.length > 0 && (

                        <div className="mt-5">

                          <h4 className="font-semibold text-gray-900">
                            Input Data
                          </h4>

                          <ul className="mt-2 list-disc pl-6 text-gray-700">

                            {testCase.inputData.map(
                              (data, index) => (

                                <li key={index}>
                                  {data}
                                </li>

                              )
                            )}

                          </ul>

                        </div>
                      )}

                      {/* =====================================================
                          EXECUTION INFO
                      ===================================================== */}

                      <div className="mt-6 grid gap-4 border-t border-gray-200 pt-5 md:grid-cols-2">

                        <div>

                          <span className="font-semibold text-gray-900">
                            Execution Status:
                          </span>{" "}

                          <span className="text-gray-700">
                            {testCase.executionStatus}
                          </span>

                        </div>

                        <div>

                          <span className="font-semibold text-gray-900">
                            Test Environment:
                          </span>{" "}

                          <span className="text-gray-700">
                            {testCase.testEnvironment ||
                              "Not specified"}
                          </span>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            {/* =====================================================
                BDD / GHERKIN
            ===================================================== */}

            {result.format === "bdd" &&
              result.scenarios && (

                <div>

                  {/* FEATURE */}

                  <div className="mb-6 rounded-lg bg-gray-900 p-5 text-white">

                    <span className="font-bold text-purple-300">
                      Feature:
                    </span>{" "}

                    {result.feature}

                  </div>

                  <div className="space-y-6">

                    {result.scenarios.map(
                      (scenario) => (

                        <div
                          key={scenario.id}
                          className="rounded-xl border border-gray-200 p-6"
                        >

                          {/* TAGS */}

                          <div className="mb-3 flex flex-wrap gap-2">

                            {scenario.tags?.map(
                              (tag) => (

                                <span
                                  key={tag}
                                  className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700"
                                >
                                  {tag}
                                </span>

                              )
                            )}

                          </div>

                          {/* ID */}

                          <div className="text-sm font-bold text-blue-600">
                            {scenario.id}
                          </div>

                          {/* SCENARIO */}

                          <h3 className="mt-1 text-xl font-bold text-gray-900">
                            Scenario:{" "}
                            {scenario.name}
                          </h3>

                          {/* =====================================================
                              GHERKIN
                          ===================================================== */}

                          <div className="mt-5 rounded-lg bg-gray-50 p-5 font-mono text-sm text-gray-800">

                            {/* GIVEN */}

                            {scenario.given?.map(
                              (step, index) => (

                                <div
                                  key={`given-${index}`}
                                  className="mb-2"
                                >

                                  <span className="font-bold text-blue-700">

                                    {index === 0
                                      ? "Given"
                                      : "And"}

                                  </span>{" "}

                                  {step}

                                </div>

                              )
                            )}

                            {/* WHEN */}

                            {scenario.when?.map(
                              (step, index) => (

                                <div
                                  key={`when-${index}`}
                                  className="mb-2"
                                >

                                  <span className="font-bold text-orange-700">

                                    {index === 0
                                      ? "When"
                                      : "And"}

                                  </span>{" "}

                                  {step}

                                </div>

                              )
                            )}

                            {/* THEN */}

                            {scenario.then?.map(
                              (step, index) => (

                                <div
                                  key={`then-${index}`}
                                  className="mb-2"
                                >

                                  <span className="font-bold text-green-700">

                                    {index === 0
                                      ? "Then"
                                      : "And"}

                                  </span>{" "}

                                  {step}

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>
              )}

          </div>
        )}

      </div>
    </main>
  );
}