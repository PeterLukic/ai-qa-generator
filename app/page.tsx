"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* HERO */}

        <div className="rounded-2xl bg-white p-10 shadow">

          <h1 className="text-4xl font-bold text-gray-900">
            AI QA Studio
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Generate test cases, Page Object Models and
            BDD Step Definitions from your application DOM
            using AI-assisted QA workflows.
          </p>

        </div>

        {/* FEATURES */}

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
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
              Page Object Models from application DOM.
            </p>

            <Link
              href="/pom"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Steps
            </Link>

          </div>

        </div>

        {/* WORKFLOW */}

        <div className="mt-8 rounded-2xl bg-white p-8 shadow">

          <h2 className="text-2xl font-bold text-gray-900">
            AI QA Workflow
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-5">

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <div className="font-semibold text-gray-900">
                DOM
              </div>
            </div>

            <div className="flex items-center justify-center text-2xl text-gray-400">
              →
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <div className="font-semibold text-gray-900">
                AI Generator
              </div>
            </div>

            <div className="flex items-center justify-center text-2xl text-gray-400">
              →
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <div className="font-semibold text-gray-900">
                QA Reviewer
              </div>
            </div>

          </div>

        </div>

        {/* SETTINGS */}

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