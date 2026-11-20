"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <div className="grid items-center gap-8 lg:grid-cols-2">

            {/* HERO TEXT */}

            <div className="p-10 lg:p-12">

              <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                AI-Assisted QA Automation
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
                AI QA Studio
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                Generate test cases, Page Object Models and
                Playwright-BDD Step Definitions using
                AI-assisted QA workflows.
              </p>

              <p className="mt-4 max-w-xl text-gray-500">
                Turn application DOM, Gherkin scenarios and
                automation models into reusable QA assets
                with AI Generator and QA Reviewer workflows.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  href="/ts"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Create Test Cases
                </Link>

                <Link
                  href="/settings"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Configure AI
                </Link>

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="flex items-center justify-center p-5 lg:p-6">

              <Image
                src="/AiQaStudio.png"
                alt="AI QA Studio intelligent QA automation"
                width={1600}
                height={900}
                priority
                className="h-auto w-full rounded-xl object-contain"
              />

            </div>

          </div>

        </div>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* TEST CASES */}

          <div className="rounded-2xl bg-white p-8 shadow">

            <div className="text-sm font-semibold text-blue-600">
              TEST DESIGN
            </div>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Create Test Cases
            </h2>

            <p className="mt-3 text-gray-600">
              Upload application DOM and generate
              Simple, Detailed or BDD regression test cases.
            </p>

            <Link
              href="/ts"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Test Cases
            </Link>

          </div>

          {/* POM */}

          <div className="rounded-2xl bg-white p-8 shadow">

            <div className="text-sm font-semibold text-green-600">
              AUTOMATION
            </div>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Create POM
            </h2>

            <p className="mt-3 text-gray-600">
              Generate reusable Playwright or Mobilewright
              Page Object Models directly from application DOM.
            </p>

            <Link
              href="/pom"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create POM
            </Link>

          </div>

          {/* STEPS */}

          <div className="rounded-2xl bg-white p-8 shadow">

            <div className="text-sm font-semibold text-purple-600">
              BDD AUTOMATION
            </div>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Create Steps
            </h2>

            <p className="mt-3 text-gray-600">
              Generate Playwright-BDD Step Definitions
              from a Gherkin feature file and Page Object Model.
            </p>

            <Link
              href="/steps"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Steps
            </Link>

          </div>

        </div>

        {/* =====================================================
            GETTING STARTED
        ===================================================== */}

        <div className="mt-8 rounded-2xl bg-white p-8 shadow">

          <h2 className="text-2xl font-bold text-gray-900">
            Getting Started
          </h2>

          <p className="mt-2 text-gray-600">
            AI QA Studio uses Groq to run the AI models.
            You need your own Groq API key before generating
            test cases, Page Objects or Step Definitions.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {/* STEP 1 */}

            <div className="rounded-xl border border-gray-200 p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                1
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Create a Groq API Key
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Open the Groq API Keys page and create
                your personal API key.
              </p>

              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Create Groq API Key →
              </a>

            </div>

            {/* STEP 2 */}

            <div className="rounded-xl border border-gray-200 p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                2
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Configure Settings
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Copy your Groq API key, open Settings,
                paste the key, test the connection
                and click Save Settings.
              </p>

              <Link
                href="/settings"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Open Settings →
              </Link>

            </div>

            {/* STEP 3 */}

            <div className="rounded-xl border border-gray-200 p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                3
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Start Generating
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Generate regression test cases, Page Object Models
                and Playwright-BDD Step Definitions.
              </p>

              <Link
                href="/ts"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Start with Test Cases →
              </Link>

            </div>

          </div>

          {/* SECURITY NOTE */}

          <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
            Keep your API key private. Do not share it or commit it
            to GitHub. AI QA Studio stores your key only in the
            current browser session.
          </div>

        </div>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <div className="mt-8 rounded-2xl bg-white p-8 shadow">

          <h2 className="text-2xl font-bold text-gray-900">
            AI QA Workflow
          </h2>

          <p className="mt-2 text-gray-600">
            AI QA Studio uses a two-stage workflow where one
            AI model generates the initial QA asset and another
            model reviews and improves the result.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">

            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-sm text-gray-500">
                Input
              </div>

              <div className="mt-1 font-semibold text-gray-900">
                DOM / Feature / POM
              </div>
            </div>

            <div className="flex items-center justify-center text-2xl text-gray-400">
              →
            </div>

            <div className="rounded-xl bg-blue-50 p-6 text-center">
              <div className="text-sm text-blue-500">
                Agent 1
              </div>

              <div className="mt-1 font-semibold text-blue-900">
                AI Generator
              </div>
            </div>

            <div className="flex items-center justify-center text-2xl text-gray-400">
              →
            </div>

            <div className="rounded-xl bg-green-50 p-6 text-center">
              <div className="text-sm text-green-600">
                Agent 2
              </div>

              <div className="mt-1 font-semibold text-green-900">
                QA Reviewer
              </div>
            </div>

          </div>

        </div>

        {/* =====================================================
            BEFORE GENERATING
        ===================================================== */}

        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <h3 className="font-semibold text-blue-900">
            Before generating
          </h3>

          <p className="mt-2 text-sm text-blue-800">
            Configure your Groq API key and AI models in Settings.
          </p>

          <Link
            href="/settings"
            className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
          >
            Open Settings →
          </Link>

        </div>

      </div>
    </main>
  );
}