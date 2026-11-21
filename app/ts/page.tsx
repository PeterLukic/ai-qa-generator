"use client";

import { useState } from "react";
import { cleanDom } from "@/lib/domCleaner";
import { chunkDom } from "@/lib/domChunker";

type TestCaseFormat =
    | "detailed"
    | "bdd";

type TestFocus =
    | "critical"
    | "smoke"
    | "positive"
    | "negative"
    | "edge"
    | "balanced";

type TableTestCase = {
    id: string;
    title: string;
    priority:
    | "P1"
    | "P2"
    | "P3";
    testSteps: string[];
    expectedResult: string;
    status: string;
    bugId: string;
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

    format:
    TestCaseFormat;

    testFocus?: TestFocus;

    model?: string;

    testCases?:
    TableTestCase[];

    feature?: string;

    scenarios?:
    BddScenario[];
};

export default function Home() {
    const [
        fileName,
        setFileName,
    ] = useState("");

    const [
        fileContent,
        setFileContent,
    ] = useState("");

    const [
        testFocus,
        setTestFocus,
    ] =
        useState<TestFocus>(
            "critical"
        );

    const [
        testCaseFormat,
        setTestCaseFormat,
    ] =
        useState<TestCaseFormat>(
            "detailed"
        );

    const [
        result,
        setResult,
    ] =
        useState<GeneratedResult | null>(
            null
        );

    const [
        isGenerating,
        setIsGenerating,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState("");

    // =====================================================
    // GENERATE TESTS
    // =====================================================

    const generateTests =
        async () => {
            if (!fileContent) {
                alert(
                    "Please upload a DOM / HTML file first."
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

            // =================================================
            // API KEY CHECK
            // =================================================

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

                // =================================================
                // CALL GENERATE-TC API
                // =================================================

                const response =
                    await fetch(
                        "/api/generate-tc",
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
                                        fileContent,

                                    testFocus,

                                    testCaseFormat,

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
                        "Failed to generate regression test cases."
                    );
                }

                console.log(
                    "Backend response:",
                    data
                );

                setResult(
                    data
                );

            } catch (err) {
                console.error(
                    "Generation error:",
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
                        Generate focused regression test cases
                        from your application DOM using AI-assisted
                        QA review.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">

                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                            Table Test Cases
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

                            onChange={async (
                                event
                            ) => {
                                const file =
                                    event.target
                                        .files?.[0];

                                if (!file) {
                                    return;
                                }

                                setFileName(
                                    file.name
                                );

                                const content =
                                    await file.text();

                                const cleanedContent =
                                    cleanDom(
                                        content
                                    );
                                const chunks =
                                    chunkDom(
                                        cleanedContent
                                    );

                                console.log(
                                    "Semantic DOM chunks:",
                                    chunks.map(
                                        (chunk) => ({
                                            id:
                                                chunk.id,

                                            document:
                                                chunk.documentIndex,

                                            length:
                                                chunk.length,
                                        })
                                    )
                                );

                                console.log(
                                    "Total chunks:",
                                    chunks.length
                                );

                                setFileContent(
                                    cleanedContent
                                );

                                setResult(
                                    null
                                );

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

                    {/* =================================================
              SELECTED FILE
          ================================================= */}

                    {fileName && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-700">

                            Selected file:{" "}

                            <strong>
                                {fileName}
                            </strong>

                        </div>
                    )}

                    {/* =================================================
              CLEANED DOM
          ================================================= */}

                    {fileContent && (
                        <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-700">

                            ✓ DOM successfully loaded and cleaned.

                        </div>
                    )}

                    {/* =====================================================
              SETTINGS
          ===================================================== */}

                    <div className="mt-8 grid gap-6 md:grid-cols-2">

                        {/* TEST FOCUS */}

                        <div>

                            <label className="block font-medium text-gray-700">
                                Test Focus
                            </label>

                            <select
                                value={
                                    testFocus
                                }

                                onChange={(
                                    event
                                ) => {
                                    setTestFocus(
                                        event.target
                                            .value as TestFocus
                                    );

                                    setResult(
                                        null
                                    );

                                    setError("");
                                }}

                                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
                            >

                                <option value="critical">
                                    Critical Regression (Recommended)
                                </option>

                                <option value="smoke">
                                    Smoke Tests
                                </option>

                                <option value="positive">
                                    Positive Tests
                                </option>

                                <option value="negative">
                                    Negative Tests
                                </option>

                                <option value="edge">
                                    Edge Cases
                                </option>

                                <option value="balanced">
                                    Balanced Coverage
                                </option>

                            </select>

                            <p className="mt-2 text-sm text-gray-500">
                                Select the type of regression coverage
                                you want the AI to prioritize.
                            </p>

                        </div>

                        {/* TEST CASE FORMAT */}

                        <div>

                            <label className="block font-medium text-gray-700">
                                Test Case Format
                            </label>

                            <select
                                value={
                                    testCaseFormat
                                }

                                onChange={(
                                    event
                                ) => {
                                    setTestCaseFormat(
                                        event.target
                                            .value as TestCaseFormat
                                    );

                                    setResult(
                                        null
                                    );

                                    setError("");
                                }}

                                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
                            >

                                <option value="detailed">
                                    Table Test Cases
                                </option>

                                <option value="bdd">
                                    BDD / Gherkin
                                </option>

                            </select>

                            <p className="mt-2 text-sm text-gray-500">
                                Choose between Excel-friendly test cases
                                or automation-ready BDD scenarios.
                            </p>

                        </div>

                    </div>

                    {/* =====================================================
              GENERATE BUTTON
          ===================================================== */}

                    <button
                        onClick={
                            generateTests
                        }

                        disabled={
                            isGenerating
                        }

                        className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >

                        {isGenerating
                            ? "QA is generating regression coverage..."
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
                TABLE TEST CASES
            ===================================================== */}

                        {result.format ===
                            "detailed" &&
                            result.testCases && (

                                <div className="overflow-x-auto">

                                    <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">

                                        <thead className="bg-gray-100">

                                            <tr>

                                                <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Test Case ID
                                                </th>

                                                <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Title
                                                </th>

                                                <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Priority
                                                </th>

                                                <th className="min-w-[300px] border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Test Steps
                                                </th>

                                                <th className="min-w-[260px] border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Expected Result
                                                </th>

                                                <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Status
                                                </th>

                                                <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                                                    Bug ID
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {result.testCases.map(
                                                (
                                                    testCase
                                                ) => (

                                                    <tr
                                                        key={
                                                            testCase.id
                                                        }
                                                        className="align-top hover:bg-gray-50"
                                                    >

                                                        <td className="whitespace-nowrap border border-gray-300 px-4 py-4 font-semibold text-blue-700">

                                                            {
                                                                testCase.id
                                                            }

                                                        </td>

                                                        <td className="border border-gray-300 px-4 py-4 font-medium text-gray-900">

                                                            {
                                                                testCase.title
                                                            }

                                                        </td>

                                                        <td className="whitespace-nowrap border border-gray-300 px-4 py-4">

                                                            <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700">

                                                                {
                                                                    testCase.priority
                                                                }

                                                            </span>

                                                        </td>

                                                        <td className="border border-gray-300 px-4 py-4 text-gray-700">

                                                            <ol className="list-decimal space-y-2 pl-5">

                                                                {testCase.testSteps?.map(
                                                                    (
                                                                        step,
                                                                        index
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {step}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ol>

                                                        </td>

                                                        <td className="border border-gray-300 px-4 py-4 text-gray-700">

                                                            {
                                                                testCase.expectedResult
                                                            }

                                                        </td>

                                                        <td className="whitespace-nowrap border border-gray-300 px-4 py-4">

                                                            <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">

                                                                {
                                                                    testCase.status
                                                                }

                                                            </span>

                                                        </td>

                                                        <td className="border border-gray-300 px-4 py-4 text-gray-700">

                                                            {testCase.bugId ||
                                                                "—"}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        {/* =====================================================
                BDD / GHERKIN
            ===================================================== */}

                        {result.format ===
                            "bdd" &&
                            result.scenarios && (

                                <div>

                                    <div className="mb-6 rounded-lg bg-gray-900 p-5 text-white">

                                        <span className="font-bold text-purple-300">
                                            Feature:
                                        </span>{" "}

                                        {
                                            result.feature
                                        }

                                    </div>

                                    <div className="space-y-6">

                                        {result.scenarios.map(
                                            (
                                                scenario
                                            ) => (

                                                <div
                                                    key={
                                                        scenario.id
                                                    }
                                                    className="rounded-xl border border-gray-200 p-6"
                                                >

                                                    {/* TAGS */}

                                                    <div className="mb-3 flex flex-wrap gap-2">

                                                        {scenario.tags?.map(
                                                            (
                                                                tag
                                                            ) => (

                                                                <span
                                                                    key={
                                                                        tag
                                                                    }
                                                                    className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700"
                                                                >

                                                                    {
                                                                        tag
                                                                    }

                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                    {/* ID */}

                                                    <div className="text-sm font-bold text-blue-600">

                                                        {
                                                            scenario.id
                                                        }

                                                    </div>

                                                    {/* SCENARIO */}

                                                    <h3 className="mt-1 text-xl font-bold text-gray-900">

                                                        Scenario:{" "}

                                                        {
                                                            scenario.name
                                                        }

                                                    </h3>

                                                    {/* GHERKIN */}

                                                    <div className="mt-5 rounded-lg bg-gray-50 p-5 font-mono text-sm text-gray-800">

                                                        {scenario.given?.map(
                                                            (
                                                                step,
                                                                index
                                                            ) => (

                                                                <div
                                                                    key={`given-${index}`}
                                                                    className="mb-2"
                                                                >

                                                                    <span className="font-bold text-blue-700">

                                                                        {index ===
                                                                            0
                                                                            ? "Given"
                                                                            : "And"}

                                                                    </span>{" "}

                                                                    {step}

                                                                </div>

                                                            )
                                                        )}

                                                        {scenario.when?.map(
                                                            (
                                                                step,
                                                                index
                                                            ) => (

                                                                <div
                                                                    key={`when-${index}`}
                                                                    className="mb-2"
                                                                >

                                                                    <span className="font-bold text-orange-700">

                                                                        {index ===
                                                                            0
                                                                            ? "When"
                                                                            : "And"}

                                                                    </span>{" "}

                                                                    {step}

                                                                </div>

                                                            )
                                                        )}

                                                        {scenario.then?.map(
                                                            (
                                                                step,
                                                                index
                                                            ) => (

                                                                <div
                                                                    key={`then-${index}`}
                                                                    className="mb-2"
                                                                >

                                                                    <span className="font-bold text-green-700">

                                                                        {index ===
                                                                            0
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