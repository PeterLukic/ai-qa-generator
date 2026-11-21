"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  accent:
    | "blue"
    | "green"
    | "purple";
  icon: React.ReactNode;
};

function FeatureCard({
  eyebrow,
  title,
  description,
  href,
  buttonLabel,
  accent,
  icon,
}: FeatureCardProps) {
  const accentStyles = {
    blue: {
      border:
        "border-blue-100",
      icon:
        "bg-blue-50 text-blue-600",
      eyebrow:
        "text-blue-600",
      glow:
        "group-hover:border-blue-200",
    },

    green: {
      border:
        "border-green-100",
      icon:
        "bg-green-50 text-green-600",
      eyebrow:
        "text-green-600",
      glow:
        "group-hover:border-green-200",
    },

    purple: {
      border:
        "border-purple-100",
      icon:
        "bg-purple-50 text-purple-600",
      eyebrow:
        "text-purple-600",
      glow:
        "group-hover:border-purple-200",
    },
  };

  const styles =
    accentStyles[
      accent
    ];

  return (
    <div
      className={`group flex h-full flex-col rounded-2xl border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.border} ${styles.glow}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
      >
        {icon}
      </div>

      <div
        className={`mt-6 text-xs font-bold uppercase tracking-[0.16em] ${styles.eyebrow}`}
      >
        {eyebrow}
      </div>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>

      <p className="mt-3 flex-1 leading-7 text-slate-600">
        {description}
      </p>

      <Link
        href={
          href
        }
        className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        {buttonLabel}

        <span aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [
    hasGroqKey,
    setHasGroqKey,
  ] =
    useState(true);

  useEffect(
    () => {
      const apiKey =
        sessionStorage.getItem(
          "groqApiKey"
        );

      setHasGroqKey(
        Boolean(
          apiKey
        )
      );
    },
    []
  );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-16 -z-0 h-[620px] overflow-hidden">

        <div className="absolute left-[-140px] top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute right-[-120px] top-0 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="grid items-center gap-8 lg:grid-cols-[1.03fr_0.97fr]">

            {/* HERO TEXT */}

            <div className="p-8 sm:p-10 lg:p-14">

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

                <span className="flex h-2 w-2 rounded-full bg-blue-500" />

                AI-Assisted QA Automation

              </div>

              <h1 className="mt-7 max-w-2xl text-5xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">

                Build better QA assets

                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  faster with AI.
                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">

                Generate focused regression tests,
                reusable Page Object Models and
                Playwright-BDD Step Definitions
                from real application inputs.

              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">

                AI QA Studio combines an AI Generator
                with a Senior QA Reviewer workflow to
                turn DOM, Gherkin and automation models
                into reusable QA assets.

              </p>

              {/* CTA */}

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  href="/ts"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Create Test Cases

                  <span aria-hidden>
                    →
                  </span>
                </Link>

                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Open Settings
                </Link>

              </div>

              {/* SMALL BENEFITS */}

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

                <div className="flex items-center gap-2">
                  <span className="text-green-600">
                    ✓
                  </span>
                  Generator + Reviewer
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-600">
                    ✓
                  </span>
                  Export-ready results
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-600">
                    ✓
                  </span>
                  Automation-focused
                </div>

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="relative flex items-center justify-center p-5 lg:p-6">

              <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-blue-100/80 via-transparent to-purple-100/80 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-2xl">

                <Image
                  src="/AiQaStudio.png"
                  alt="AI QA Studio intelligent QA automation"
                  width={
                    1600
                  }
                  height={
                    900
                  }
                  priority
                  className="h-auto w-full object-cover"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FIRST-TIME SETUP
        ===================================================== */}

        {!hasGroqKey && (

          <section className="mt-8 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  First Time Setup
                </div>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Connect your AI provider before you start
                </h2>

                <p className="mt-2 max-w-2xl leading-7 text-slate-600">
                  AI QA Studio currently uses your own Groq API key.
                  Add it in Settings before generating Test Cases,
                  Page Objects or Step Definitions.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  1. Create API Key
                </a>

                <Link
                  href="/settings"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  2. Configure AI
                </Link>

              </div>

            </div>

          </section>

        )}

        {/* =====================================================
            MAIN WORKSPACE
        ===================================================== */}

        <section className="mt-12">

          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                AI QA Workspace
              </div>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Choose your workflow
              </h2>

              <p className="mt-2 max-w-2xl text-slate-600">
                Start from application DOM, Gherkin scenarios
                or automation models and generate reusable QA assets.
              </p>

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <FeatureCard
              eyebrow="Test Design"
              title="Create Test Cases"
              description="Upload application DOM and generate focused Table Test Cases or automation-ready BDD / Gherkin scenarios."
              href="/ts"
              buttonLabel="Create Test Cases"
              accent="blue"
              icon={

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M9 6h11M9 12h11M9 18h11"
                    strokeLinecap="round"
                  />

                  <path
                    d="M4 6.5l1 1 2-2M4 12.5l1 1 2-2M4 18.5l1 1 2-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              }
            />

            <FeatureCard
              eyebrow="Automation"
              title="Create POM"
              description="Generate reusable Playwright or Mobilewright Page Object Models directly from application DOM."
              href="/pom"
              buttonLabel="Create POM"
              accent="green"
              icon={

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                  />

                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                  />

                  <rect
                    x="8.5"
                    y="14"
                    width="7"
                    height="7"
                    rx="1.5"
                  />

                  <path
                    d="M6.5 10v2h11v-2M12 12v2"
                    strokeLinecap="round"
                  />
                </svg>

              }
            />

            <FeatureCard
              eyebrow="BDD Automation"
              title="Create Steps"
              description="Generate Playwright-BDD Step Definitions from a Gherkin feature file and your Page Object Model."
              href="/steps"
              buttonLabel="Create Steps"
              accent="purple"
              icon={

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M6 4h12M6 10h12M6 16h8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M16 17l2 2 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              }
            />

          </div>

        </section>

        {/* =====================================================
            WHY AI QA STUDIO
        ===================================================== */}

        <section className="mt-12 rounded-[28px] bg-slate-950 p-8 text-white shadow-xl sm:p-10 lg:p-12">

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">

            <div>

              <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                Why AI QA Studio
              </div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From raw application input to reusable QA assets.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Reduce repetitive setup work while keeping QA engineers
                in control of what is worth automating and maintaining.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="text-2xl font-bold text-blue-400">
                  01
                </div>

                <h3 className="mt-5 font-semibold">
                  Faster QA setup
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Generate a focused automation foundation
                  from real application inputs.
                </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="text-2xl font-bold text-green-400">
                  02
                </div>

                <h3 className="mt-5 font-semibold">
                  Reusable assets
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Export test cases, feature files,
                  Page Objects and Step Definitions.
                </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="text-2xl font-bold text-purple-400">
                  03
                </div>

                <h3 className="mt-5 font-semibold">
                  AI QA review
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Generator and Reviewer agents work together
                  before the final output is returned.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            GETTING STARTED
        ===================================================== */}

        <section className="mt-12">

          <div>

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Getting Started
            </div>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Start in three simple steps
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
              Configure your AI connection once,
              then move directly into your QA workflow.
            </p>

          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-3">

            {/* STEP 1 */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  1
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Connect
                </div>

              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Create a Groq API Key
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Create your personal API key in the Groq console.
              </p>

              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Create API Key
                <span>
                  →
                </span>
              </a>

            </div>

            {/* STEP 2 */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 font-bold text-white">
                  2
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Configure
                </div>

              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Configure AI Settings
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Paste the key, choose Generator and Reviewer models,
                test the connection and save.
              </p>

              <Link
                href="/settings"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Open Settings
                <span>
                  →
                </span>
              </Link>

            </div>

            {/* STEP 3 */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 font-bold text-white">
                  3
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Generate
                </div>

              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Start your QA workflow
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Generate Test Cases, Page Objects
                or BDD Step Definitions.
              </p>

              <Link
                href="/ts"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Start with Test Cases
                <span>
                  →
                </span>
              </Link>

            </div>

          </div>

          {/* SECURITY */}

          <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">

            <div className="mt-0.5 font-bold">
              🔒
            </div>

            <div>
              Your Groq API key is stored only in the current browser
              session. Keep it private and never commit it to GitHub.
            </div>

          </div>

        </section>

        {/* =====================================================
            AI WORKFLOW
        ===================================================== */}

        <section className="mt-12 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

          <div className="text-center">

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              AI QA Workflow
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Two AI agents. One reviewed output.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              The Generator creates the first QA asset.
              The Reviewer then checks quality, removes weak output
              and returns the final result.
            </p>

          </div>

          <div className="mt-10 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">

            {/* INPUT */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                📄
              </div>

              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Input
              </div>

              <div className="mt-2 font-bold text-slate-950">
                DOM / Feature / POM
              </div>

            </div>

            {/* ARROW */}

            <div className="hidden items-center justify-center text-2xl text-slate-300 md:flex">
              →
            </div>

            {/* GENERATOR */}

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20">
                ✦
              </div>

              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-500">
                Agent 1
              </div>

              <div className="mt-2 font-bold text-blue-950">
                AI Generator
              </div>

            </div>

            {/* ARROW */}

            <div className="hidden items-center justify-center text-2xl text-slate-300 md:flex">
              →
            </div>

            {/* REVIEWER */}

            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-xl text-white shadow-lg shadow-green-600/20">
                ✓
              </div>

              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-green-600">
                Agent 2
              </div>

              <div className="mt-2 font-bold text-green-950">
                Senior QA Reviewer
              </div>

            </div>

          </div>

          {/* OUTPUTS */}

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Table Test Cases
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              BDD / Gherkin
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Page Object Models
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Step Definitions
            </span>

          </div>

        </section>

        {/* =====================================================
            FOOTER NOTE
        ===================================================== */}

        <div className="mt-10 pb-4 text-center text-sm text-slate-400">
          AI QA Studio · AI-assisted quality engineering workflows
        </div>

      </div>

    </main>
  );
}