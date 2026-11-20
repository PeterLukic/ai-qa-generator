"use client";

import { useState } from "react";

type StepsResult = {
  success: boolean;
  model: string;
  code: string;
};

export default function StepsPage() {
  const [featureFileName, setFeatureFileName] =
    useState("");

  const [featureContent, setFeatureContent] =
    useState("");

  const [pomFileName, setPomFileName] =
    useState("");

  const [pomContent, setPomContent] =
    useState("");

  const [result, setResult] =
    useState<StepsResult | null>(null);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // OUTPUT FILE NAME
  // =====================================================

  const getOutputFileName = () => {
    if (!featureFileName) {
      return "steps.generated.ts";
    }

    const baseName =
      featureFileName
        .replace(/\.feature$/i, "")
        .replace(/\.txt$/i, "")
        .trim();

    return `steps.${baseName || "generated"}.ts`;
  };

  // =====================================================
  // GENERATE STEP DEFINITIONS
  // =====================================================

  const generateSteps = async () => {
    if (!featureContent) {
      setError(
        "Please upload a BDD feature file."
      );

      return;
    }

    if (!pomContent) {
      setError(
        "Please upload a Page Object Model."
      );

      return;
    }

    // =================================================
    // LOAD GROQ SETTINGS
    // =================================================

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
      setIsGenerating(true);
      setError("");
      setResult(null);

      const response =
        await fetch(
          "/api/generate-steps",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              featureContent,
              pomContent,

              apiKey,
              generatorModel,
              reviewerModel,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to generate step definitions."
        );
      }

      console.log(
        "Generated Step Definitions:",
        data
      );

      setResult(data);

    } catch (err) {
      console.error(
        "Step generation error:",
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
      setIsGenerating(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 rounded-2xl bg-white p-8 shadow">

          <h1 className="text-3xl font-bold text-gray-900">
            Create Step Definitions
          </h1>

          <p className="mt-2 text-gray-600">
            Generate Playwright-BDD step definitions from
            a BDD feature file and Page Object Model.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
              BDD
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              POM
            </span>

            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              → Step Definitions
            </span>

          </div>

        </div>

        {/* INPUTS */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <div className="grid gap-8 md:grid-cols-2">

            {/* FEATURE FILE */}

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                BDD Feature File
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload the .feature file containing
                Given / When / Then scenarios.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 hover:border-blue-500">

                <span className="font-medium text-gray-700">
                  Upload BDD Feature
                </span>

                <span className="mt-2 text-sm text-gray-500">
                  .feature or .txt
                </span>

                <input
                  type="file"
                  accept=".feature,.txt"
                  className="hidden"

                  onChange={async (
                    event
                  ) => {
                    const file =
                      event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    const content =
                      await file.text();

                    setFeatureFileName(
                      file.name
                    );

                    setFeatureContent(
                      content
                    );

                    setResult(null);
                    setError("");
                  }}
                />

              </label>

              {featureFileName && (
                <div className="mt-4 rounded-lg bg-purple-50 p-4 text-purple-700">
                  Selected feature:{" "}
                  <strong>
                    {featureFileName}
                  </strong>
                </div>
              )}

            </div>

            {/* POM FILE */}

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Page Object Model
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload the TypeScript Page Object used
                by the BDD scenarios.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 hover:border-blue-500">

                <span className="font-medium text-gray-700">
                  Upload Page Object
                </span>

                <span className="mt-2 text-sm text-gray-500">
                  .ts or .txt
                </span>

                <input
                  type="file"
                  accept=".ts,.txt"
                  className="hidden"

                  onChange={async (
                    event
                  ) => {
                    const file =
                      event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    const content =
                      await file.text();

                    setPomFileName(
                      file.name
                    );

                    setPomContent(
                      content
                    );

                    setResult(null);
                    setError("");
                  }}
                />

              </label>

              {pomFileName && (
                <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-700">
                  Selected POM:{" "}
                  <strong>
                    {pomFileName}
                  </strong>
                </div>
              )}

            </div>

          </div>

          {/* READY STATUS */}

          {featureContent &&
            pomContent && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                ✓ Feature file and Page Object Model loaded successfully.
              </div>
            )}

          {/* GENERATE */}

          <button
            onClick={
              generateSteps
            }
            disabled={
              isGenerating
            }
            className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isGenerating
              ? "QA is generating Step Definitions..."
              : "Generate Step Definitions"}
          </button>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

        </div>

        {/* RESULT */}

        {result && (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow">

            {/* RESULT HEADER */}

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Generated Step Definitions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  AI Generated & QA Reviewed
                </p>

              </div>

              <div className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                {result.model}
              </div>

            </div>

            {/* FILE INFORMATION */}

            <div className="mb-5 flex flex-wrap gap-3">

              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {getOutputFileName()}
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                Playwright-BDD TypeScript
              </span>

            </div>

            {/* CODE */}

            <div className="overflow-hidden rounded-xl bg-gray-950">

              <div className="border-b border-gray-800 px-5 py-3 text-sm text-gray-400">
                {getOutputFileName()}
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